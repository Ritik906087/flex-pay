
"use client"

import { supabase } from "./supabase";

/**
 * Advanced Device Intelligence Engine
 * Handles fingerprinting, network detection, and risk calculation.
 */

export interface DeviceIntelligence {
  fingerprintId: string;
  device: {
    type: string;
    os: string;
    browser: string;
    resolution: string;
    ram?: number;
    cores?: number;
    touch: boolean;
    language: string;
    timezone: string;
  };
  network: {
    ip: string;
    isp: string;
    city: string;
    region: string;
    country: string;
    vpn: boolean;
    proxy: boolean;
    tor: boolean;
    type?: string;
  };
  riskScore: number;
  riskLevel: 'normal' | 'suspicious' | 'high-risk';
}

export const SecurityEngine = {
  /**
   * Generates a unique device fingerprint using Browser APIs
   */
  async generateFingerprint(): Promise<string> {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl?.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "";
    
    const signals = [
      navigator.userAgent,
      navigator.language,
      new Date().getTimezoneOffset(),
      screen.colorDepth,
      screen.width + 'x' + screen.height,
      renderer,
      navigator.hardwareConcurrency,
      (navigator as any).deviceMemory,
    ].join('###');

    // Simple hash function for the fingerprint
    let hash = 0;
    for (let i = 0; i < signals.length; i++) {
      const char = signals.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'FP-' + Math.abs(hash).toString(16).toUpperCase();
  },

  /**
   * Captures Network & Geo Signals via IP API
   */
  async getNetworkInfo() {
    try {
      // Using ipapi.co for detailed network intel
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) throw new Error("API Limit");
      const data = await res.json();
      
      return {
        ip: data.ip,
        isp: data.org,
        city: data.city,
        region: data.region,
        country: data.country_name,
        vpn: data.org?.toLowerCase().includes('vpn') || data.org?.toLowerCase().includes('hosting') || data.org?.toLowerCase().includes('google'),
        proxy: false,
        tor: false,
        type: data.network
      };
    } catch (e) {
      console.error("Network detection failed", e);
      // Fallback basic detection
      return {
        ip: '0.0.0.0',
        isp: 'Unknown',
        city: 'Unknown',
        region: 'Unknown',
        country: 'Unknown',
        vpn: false,
        proxy: false,
        tor: false,
        type: 'Unknown'
      };
    }
  },

  /**
   * Comprehensive Capture
   */
  async captureAll(userId: string): Promise<DeviceIntelligence | null> {
    const fingerprint = await this.generateFingerprint();
    const network = await this.getNetworkInfo();
    
    const intel: DeviceIntelligence = {
      fingerprintId: fingerprint,
      device: {
        type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        os: navigator.platform,
        browser: navigator.userAgent.split(' ')[0],
        resolution: `${window.screen.width}x${window.screen.height}`,
        ram: (navigator as any).deviceMemory || 0,
        cores: navigator.hardwareConcurrency || 0,
        touch: 'ontouchstart' in window,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      network: network,
      riskScore: 0,
      riskLevel: 'normal'
    };

    // Risk Calculation Logic
    let score = 0;
    if (intel.network.vpn) score += 40;
    if (intel.device.cores && intel.device.cores < 2) score += 20; 
    if (!intel.device.ram) score += 10;
    
    // Check for multi-account on same fingerprint
    try {
      const { count } = await supabase
        .from('user_devices')
        .select('*', { count: 'exact', head: true })
        .eq('fingerprint_id', fingerprint)
        .neq('user_id', userId);
      
      if (count && count > 0) score += 50; 
    } catch (e) {
      console.warn("Audit count failed", e);
    }

    intel.riskScore = score;
    intel.riskLevel = score > 60 ? 'high-risk' : score > 30 ? 'suspicious' : 'normal';

    // Store in Supabase
    try {
      await supabase.from('user_devices').upsert({
        user_id: userId,
        fingerprint_id: fingerprint,
        device_info: intel.device,
        network_info: intel.network,
        risk_level: intel.riskLevel,
        last_seen: new Date().toISOString()
      });

      await supabase.from('security_events').insert({
        user_id: userId,
        event_type: 'session_audit',
        ip_address: network.ip,
        risk_score: score,
        details: intel
      });
    } catch (e) {
      console.error("Security data storage failed", e);
    }

    return intel;
  }
};
