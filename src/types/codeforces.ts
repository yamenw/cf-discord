export interface ISubmission {
    id: number
    contestId: number
    creationTimeSeconds: number
    relativeTimeSeconds: number
    problem: IProblem
    author: IAuthor
    programmingLanguage: string
    verdict: "WRONG_ANSWER" | "OK"
    testset: string
    passedTestCount: number
    timeConsumedMillis: number
    memoryConsumedBytes: number
}

export interface IProblem {
    contestId: number
    index: string
    name: string
    type: string
    points: number
    rating: number | null;
    tags: string[]
}

export interface IAuthor {
    contestId: number
    members: IMember[]
    participantType: string
    ghost: boolean
    room: number
    startTimeSeconds: number
}

export interface IMember {
    handle: string
}

export interface ISubmissionModel {
    rating: number;
    creation_time: string;
    verdict: "WRONG_ANSWER" | "OK";
    user_handle: string;
    problem_id: string;
}