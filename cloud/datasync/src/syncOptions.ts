export interface PendingWorkerBackoff {
    strategy?: string;
    max?: string;
}

export interface AckWorkerBackoff {
    strategy?: string;
    max?: string;
}

export interface SyncWorkerBackoff {
    strategy?: string;
    max?: number;
}

interface SyncGlobalOptions {
    pendingWorkerInterval?: number;
    pendingWorkerConcurrency?: number;
    pendingWorkerBackoff?: PendingWorkerBackoff;
    ackWorkerInterval?: number;
    ackWorkerConcurrency?: number;
    ackWorkerBackoff?: AckWorkerBackoff;
    syncWorkerInterval?: number;
    syncWorkerConcurrency?: number;
    syncWorkerBackoff?: SyncWorkerBackoff;
    schedulerInterval?: number;
    schedulerLockMaxTime?: number;
    /**
     * How many time
     */
    schedulerLockName?: string;
    datasetClientUpdateConcurrency?: number;
    collectStats?: boolean;
    statsRecordsToKeep?: number;
    collectStatsInterval?: number;
    metricsInfluxdbHost?: string;
    metricsInfluxdbPort?: number;
    metricsReportConcurrency?: number;
    useCache?: boolean;
    queueMessagesTTL?: string;
    datasetClientCleanerCheckFrequency?: string;
}

export default SyncGlobalOptions;