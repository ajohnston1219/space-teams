import * as uuid from "uuid";

export default class Competition {
    constructor(
        private _id: string,
        private _name: string
    ) {}

    public get id(): string { return this._id; }
    public get name(): string { return this._name; }
}

export class CompetitionFactory {
    public static createCompetition(
        name: string
    ): Competition {
        return new Competition(this.generateId(), name);
    }

    private static generateId() { return uuid.v4(); }
}
