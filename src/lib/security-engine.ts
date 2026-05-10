
"use client"

import { supabase } from "./supabase";
import { UAParser } from 'ua-parser-js';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

/**
 * Advanced SENTINEL Security Engine
 */

export interface DeviceIntelligence {
  fingerprintId: string;
  device: {
    type: string;
    os: string;
    osVersion?: string;
    browser: string;
    browserVersion?: string;
    resolution: string;
    ram: number;
    cores: number;
    touch: boolean;
    language: string;
    timezone: string;
    platform: string;
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
    connectionType?: string;
    webrtcIP?: string | null;
  };
  riskScore: number;
  riskLevel: 'normal' | 'suspicious' | 'high-risk';
  timestamp: string;
}

export const SecurityEngine = {
  /**
   * Generates a persistent device fingerprint using FingerprintJS
   */
  async generateFingerprint(): Promise<string> {
    try {
      console.log("[SENTINEL] Initializing FingerprintJS...");
      const fpPromise = FingerprintJS.load();
      const fp = await fpPromise;
      const result = await fp.get();
      console.log("[SENTINEL] Fingerprint Generated:", result.visitorId);
      return result.visitorId;
    } catch (e) {
      console.error("[SENTINEL] Fingerprint Error:", e);
      // Fallback simple fingerprint
      return `FB-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
  },

  /**
   * Detects local IP via WebRTC Leak
   */
  async getWebRTCIP(): Promise<string | null> {
    return new Promise((resolve) => {
      try {
        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel("");
        pc.createOffer().then(pc.setLocalDescription.bind(pc));
        pc.onicecandidate = (ice) => {
          if (ice && ice.candidate && ice.candidate.candidate) {
            const ipMatch = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(ice.candidate.candidate);
            if (ipMatch) {
              console.log("[SENTINEL] WebRTC IP Detected:", ipMatch[1]);
              resolve(ipMatch[1]);
            }
          }
        };
        setTimeout(() => resolve(null), 1500);
      } catch (e) {
        resolve(null);
      }
    });
  },

  /**
   * Captures Network & Geo Intelligence with Fallbacks
   */
  async getNetworkInfo() {
    console.log("[SENTINEL] Fetching Network Intelligence...");
    let networkData = {
      ip: '0.0.0.0',
      isp: 'Unknown',
      city: 'Unknown',
      region: 'Unknown',
      country: 'Unknown',
      vpn: false,
      proxy: false,
      tor: false,
      connectionType: (navigator as any).connection?.effectiveType || 'WiFi/Broadband'
    };

    try {
      // Primary API: ipapi.co (Detailed Geo + VPN)
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        networkData = {
          ...networkData,
          ip: data.ip || '0.0.0.0',
          isp: data.org || 'Unknown',
          city: data.city || 'Unknown',
          region: data.region || 'Unknown',
          country: data.country_name || 'Unknown',
          vpn: this.detectVPNByISP(data.org)
        };
        console.log("[SENTINEL] Network Data Received (Primary):", networkData.ip);
        return networkData;
      }
    } catch (e) {
      console.warn("[SENTINEL] Primary Network API failed, trying fallback...");
    }

    try {
      // Fallback API: ipify (Pure IP)
      const res = await fetch('https://api.ipify.org?format=json');
      if (res.ok) {
        const data = await res.json();
        networkData.ip = data.ip;
        console.log("[SENTINEL] Network Data Received (Fallback):", networkData.ip);
      }
    } catch (e) {
      console.error("[SENTINEL] All Network APIs failed.");
    }

    return networkData;
  },

  detectVPNByISP(isp: string): boolean {
    if (!isp) return false;
    const keywords = ['vpn', 'hosting', 'proxy', 'datacenter', 'digitalocean', 'google cloud', 'amazon', 'azure', 'akamai', 'cloudflare', 'tor', 'exit'];
    const lowerIsp = isp.toLowerCase();
    return keywords.some(k => lowerIsp.includes(k));
  },

  /**
   * Main Capture & Sync Routine
   */
  async captureAll(userId: string): Promise<DeviceIntelligence | null> {
    console.log("[SENTINEL] Starting Full Security Audit for User:", userId);
    
    try {
      const fingerprint = await this.generateFingerprint();
      const network = await this.getNetworkInfo();
      const webrtcIP = await this.getWebRTCIP();
      
      const parser = new UAParser();
      const ua = parser.getResult();

      const intel: DeviceIntelligence = {
        fingerprintId: fingerprint,
        device: {
          type: ua.device.type || 'desktop',
          os: ua.os.name || navigator.platform,
          osVersion: ua.os.version,
          browser: ua.browser.name || 'Unknown',
          browserVersion: ua.browser.version,
          resolution: `${window.screen.width}x${window.screen.height}`,
          ram: (navigator as any).deviceMemory || 4,
          cores: navigator.hardwareConcurrency || 2,
          touch: 'ontouchstart' in window,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          platform: navigator.platform
        },
        network: {
          ...network,
          webrtcIP: webrtcIP
        },
        riskScore: 0,
        riskLevel: 'normal',
        timestamp: new Date().toISOString()
      };

      // ADVANCED RISK LOGIC
      let score = 0;
      if (intel.network.vpn) score += 45;
      if (intel.network.webrtcIP && intel.network.webrtcIP !== intel.network.ip) score += 20; // Possible Proxy/VPN leak
      if (intel.device.cores < 2) score += 15; // Low power usually means bot/emulator
      if (intel.device.type === 'desktop' && intel.device.touch) score += 10; // Desktop with touch (rare, unless high-end)

      // Multi-Account Detection
      const { count } = await supabase
        .from('user_devices')
        .select('*', { count: 'exact', head: true })
        .eq('fingerprint_id', fingerprint)
        .neq('user_id', userId);
      
      if (count && count > 0) {
        score += 50;
        console.warn("[SENTINEL] Multi-Account detected on fingerprint:", fingerprint);
      }

      intel.riskScore = score;
      intel.riskLevel = score > 65 ? 'high-risk' : score > 35 ? 'suspicious' : 'normal';

      console.log("[SENTINEL] Final Audit Result:", intel.riskLevel, "(Score:", score, ")");

      // PERSIST DATA
      await supabase.from('user_devices').upsert({
        user_id: userId,
        fingerprint_id: fingerprint,
        device_info: intel.device,
        network_info: intel.network,
        risk_level: intel.riskLevel,
        last_seen: new Date().toISOString()
      }, { onConflict: 'user_id, fingerprint_id' });

      await supabase.from('security_events').insert({
        user_id: userId,
        event_type: 'session_audit',
        ip_address: intel.network.ip,
        risk_score: score,
        details: intel
      });

      return intel;
    } catch (e) {
      console.error("[SENTINEL] Critical Audit Failure:", e);
      return null;
    }
  }
};
