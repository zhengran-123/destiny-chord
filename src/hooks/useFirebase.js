import { useState, useEffect, useCallback } from 'react';

/**
 * Firebase 集成 Hook
 * 注意：需要先配置 Firebase 项目才能使用
 * 使用前请在 firebase/config.js 中填入你的 Firebase 配置
 */
export function useFirebase() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  // 检查是否已配置 Firebase
  const isConfigured = useCallback(() => {
    try {
      const { auth } = require('../firebase/config');
      return !!auth;
    } catch {
      return false;
    }
  }, []);

  const signIn = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { signInWithGoogle } = require('../firebase/config');
      const result = await signInWithGoogle();
      setUser(result.user);
      return result.user;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { signOutUser } = require('../firebase/config');
      await signOutUser();
      setUser(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const syncToCloud = useCallback(async (data) => {
    if (!user) return;
    setSyncing(true);
    try {
      const { syncUserData } = require('../firebase/config');
      await syncUserData(user.uid, data);
      setLastSync(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  }, [user]);

  const loadFromCloud = useCallback(async () => {
    if (!user) return null;
    setSyncing(true);
    try {
      const { loadUserData } = require('../firebase/config');
      const data = await loadUserData(user.uid);
      setLastSync(new Date());
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setSyncing(false);
    }
  }, [user]);

  const clearError = useCallback(() => setError(null), []);

  return {
    user,
    loading,
    error,
    syncing,
    lastSync,
    isConfigured,
    signIn,
    signOut,
    syncToCloud,
    loadFromCloud,
    clearError,
  };
}
