export interface Task {
    id: string;
    title: string;
    description: string;
    /**
     * Task status
     * @type {TaskStatus}
     * @enum
     */
    status: TaskStatus;
}

export enum TaskStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE'
}