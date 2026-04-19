'use server';

const { hashUserPassword } = require("@/lib/hash");
const { createUser } = require("@/lib/user");
const { redirect } = require("next/navigation");
const { createAuthSession } = require("@/lib/auth");


export async function signup(formData) {
    const email =formData.get('email');
    const password =formData.get('password');
     
    let errors = {};

    if(!email.includes('@')) {
        errors.email = 'Please enter a valid email address.';
    }
 
    if(password.trim().length < 8) {
        errors.password = 'Password must be at least 8 characters long.';
    }
 
     if (Object.keys(errors).length > 0) {
        return {errors: errors};
     }

     if (Object.keys(errors).length > 0) {
        return { 
            errors: errors,
        }
    }

    const hashPassword = hashUserPassword(password);
    try {
    const id = createUser(email, hashPassword);
    
    await createAuthSession(id);    
    redirect('/training');


    } catch(error) {
    if(error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        errors.email = 'It seems like you already have an account with this email address.';
    } else {
        throw error;
        }
    }
  
}


export async function login(prevState , formData ) {
    const email =formData.get('email');
    const password =formData.get('password');
     
     const existingUser  = getUserByEmail(email);

      if(!existingUser) {
        return {errors: {email: 'Could not authenticate with provided credentials.'}};
      }


       const isValidPassword = verifyPassword(
        existingUser.password,
         password
    );

    if(!isValidPassword) {
        return {errors: {email: 'Could not authenticate with provided credentials.'}};
    }

    await createAuthSession(existingUser.id);
    redirect('/training');
}

export async function auth(mode , prevState , formData) {
    if(mode === 'login') {
        return login(prevState , formData);
    } else {
        return signup(formData);
    }
}