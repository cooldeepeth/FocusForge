import type { User, Squad, SquadMember } from '../types';

// --- MOCK SQUAD DATABASE ---

const squads: Record<string, Squad> = {};
let botIntervals: Record<number, number> = {};

const botNames = ["User #A4B7", "User #C9D2", "User #H2G5", "User #F8K1", "User #L3M9"];
const botGoals = [
    "Deploying the new feature", "Studying for finals", "Refactoring the legacy code",
    "Writing my thesis proposal", "Reviewing pull requests"
];

const createNewSquad = (initialUser: User): Squad => {
    const squadId = `squad_${Date.now()}`;
    const currentUserMember: SquadMember = {
        id: initialUser.uid,
        name: initialUser.displayName || `User #${initialUser.uid.slice(0, 4)}`,
        isCurrentUser: true,
        dailyGoal: '',
        completedSessions: 0,
    };

    const botMembers: SquadMember[] = botNames.slice(0, 3).map((name, index) => ({
        id: `bot_${index}`,
        name: name,
        isCurrentUser: false,
        dailyGoal: botGoals[Math.floor(Math.random() * botGoals.length)],
        completedSessions: Math.floor(Math.random() * 3),
    }));

    const newSquad: Squad = {
        id: squadId,
        members: [currentUserMember, ...botMembers],
    };
    squads[squadId] = newSquad;
    return newSquad;
};

/**
 * Simulates a user joining a squad.
 * For simplicity, this mock will always place the user in a new squad.
 */
export const joinSquad = (user: User): Squad => {
    const squad = createNewSquad(user);
    user.squadId = squad.id;
    return squad;
};

/**
 * Simulates setting a user's daily goal.
 */
export const setDailyGoal = (squadId: string, userId: string, goal: string): Squad => {
    const squad = squads[squadId];
    if (!squad) throw new Error("Squad not found");

    squad.members = squad.members.map(member => 
        member.id === userId ? { ...member, dailyGoal: goal } : member
    );
    return { ...squad };
};

/**
 * Simulates a user making progress.
 */
export const updateProgress = (squadId: string, userId: string): Squad => {
    const squad = squads[squadId];
    if (!squad) throw new Error("Squad not found");

    squad.members = squad.members.map(member => 
        member.id === userId ? { ...member, completedSessions: member.completedSessions + 1 } : member
    );
    return { ...squad };
};

/**
 * Simulates other squad members making progress over time.
 */
export const startBotUpdates = (squadId: string, onUpdate: (squad: Squad) => void): number => {
    const intervalId = window.setInterval(() => {
        const squad = squads[squadId];
        if (!squad) {
            stopBotUpdates(intervalId);
            return;
        }

        // 30% chance a bot makes progress
        if (Math.random() < 0.3) {
            const botMembers = squad.members.filter(m => !m.isCurrentUser);
            if (botMembers.length > 0) {
                const randomBotIndex = Math.floor(Math.random() * botMembers.length);
                const botToUpdate = botMembers[randomBotIndex];

                squad.members = squad.members.map(member =>
                    member.id === botToUpdate.id ? { ...member, completedSessions: member.completedSessions + 1 } : member
                );
                onUpdate({ ...squad });
            }
        }
    }, 20000); // Check for bot updates every 20 seconds
    
    botIntervals[intervalId] = intervalId;
    return intervalId;
};

export const stopBotUpdates = (intervalId: number) => {
    clearInterval(intervalId);
    delete botIntervals[intervalId];
};
