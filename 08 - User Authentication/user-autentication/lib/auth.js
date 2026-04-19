import { Lucia } from 'lucia';
import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

const adapter = new BetterSqlite3Adapter(db, {
    user: 'users',
    session: 'sessions'
});


const lucia = new Lucia(adapter , {
    sessionCookie : {
        expires: false ,
        attributes: {
            secure: process.env.NODE_ENV === 'production',
        }
    }
});


export async function createAuthSession(userId) {
    const session = await lucia.createSession(userId , {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
        sessionCookie.name, 
        sessionCookie.value, 
        sessionCookie.attributes
    );
}

export async function  verifyAuth() {
    const sessionCookie = cookies().get(lucia.sessionCookieName);

    if(!sessionCookie) {
    return {
        user: null,
        session: null,
    };
}

    const sessionId = sessionCookie.value;

    if(!sessionId) {
        return {
            user: null,
            session: null,
        };
    }

    const result = await lucia.validateSession(sessionId);


    try {
        if(result.session && result.session.fresh) {
        const sesstionCookie =  lucia.createSessionCookie(result.session.id);
        cookies().set(
        sesstionCookie.name,
        sesstionCookie.value,
        sesstionCookie.attributes
        );
    }

    if(result.session) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
        );
    }

    if(!result.session) {
        const sesstionCookie = lucia.createBlankSessionCookie();
        cookies().set(sesstionCookie.name, sesstionCookie.value, sesstionCookie.attributes);
    }
    
    } 

        catch(error) {
        const sesstionCookie = lucia.createBlankSessionCookie();
        cookies().set(sesstionCookie.name, sesstionCookie.value, sesstionCookie.attributes);
        }

        return result;
    }



