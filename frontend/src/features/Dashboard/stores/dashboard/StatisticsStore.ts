// stores/dashboard/StatisticsStore.ts

import { makeAutoObservable, runInAction } from "mobx";
import { DashboardStats } from "../../types/dashboard";
import { getDashboardApps, getDashboardStatistic } from "api/Application";

export class StatisticsStore {
  stats: DashboardStats = {
    total: 0,
    requires_action: 0,
    in_progress: 0,
    completed: 0,
  };
  isLoading = false;
  error: Error | null = null;
  lastUpdated: Date | null = null;
  refreshInterval: number = 30000; // 30 seconds

  private refreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchStatistics() {
    try {
      this.setLoading(true);
      this.setError(null);

      // Simulated API call - replace with actual API
      // await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await getDashboardStatistic();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const mockApplications = response.data;

        runInAction(() => {
          this.stats = response.data;
          this.lastUpdated = new Date();
        });
      } else {
        throw new Error("Не получилось загрузить данные");
      }

      // const mockStats: DashboardStats = {
      //   total: 156,
      //   requiresAction: 4,
      //   inProgress: 12,
      //   completed: 140,
      // };
      //   runInAction(() => {
      //     this.stats = mockStats;
      //     this.lastUpdated = new Date();
      //   });
    } catch (error) {
      runInAction(() => {
        this.setError(error as Error);
      });
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setError(error: Error | null) {
    this.error = error;
  }

  updateStat(key: keyof DashboardStats, value: number) {
    this.stats[key] = value;
    this.lastUpdated = new Date();
  }

  incrementStat(key: keyof DashboardStats) {
    this.stats[key]++;
    this.lastUpdated = new Date();
  }

  decrementStat(key: keyof DashboardStats) {
    if (this.stats[key] > 0) {
      this.stats[key]--;
      this.lastUpdated = new Date();
    }
  }

  setRefreshInterval(interval: number) {
    this.refreshInterval = interval;
    this.stopAutoRefresh();
    this.startAutoRefresh();
  }

  startAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    this.refreshTimer = setInterval(() => {
      this.fetchStatistics();
    }, this.refreshInterval);
  }

  stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  get statsArray() {
    return [
      { key: "total", value: this.stats.total },
      { key: "requiresAction", value: this.stats.requires_action },
      { key: "inProgress", value: this.stats.in_progress },
      { key: "completed", value: this.stats.completed },
    ];
  }

  get completionRate() {
    if (this.stats.total === 0) return 0;
    return Math.round((this.stats.completed / this.stats.total) * 100);
  }

  get activeApplicationsCount() {
    return this.stats.in_progress + this.stats.requires_action;
  }

  async refreshStatistics() {
    await this.fetchStatistics();
  }

  dispose() {
    this.stopAutoRefresh();
  }
}

export const statisticsStore = new StatisticsStore();
