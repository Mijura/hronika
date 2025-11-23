export interface InitializeProjectHistory {
    /**
     * Initializes a new project history.
     * 
     * @returns A promise that resolves to the unique identifier of the newly created project history
     */
    execute(): Promise<string>
}