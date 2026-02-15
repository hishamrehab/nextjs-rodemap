import fs from "node:fs";

import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';



const db = sql('meals.db');

export async function getMeals() {
    await new Promise((resolve) => setTimeout(resolve, 5000));
   return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug){
    return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
} 

export async function saveMeal(meal) {
   meal.slug = slugify(meal.title, {lower: true});
   meal.instructions = xss(meal.instructions);

 const extension = meal.image.name.split('.').pop();
 const fileName = `${meal.slug}.${extension}`;
 const imagePath = `public/images/${fileName}`;
 const bufferedImage = await meal.image.arrayBuffer();

 try {
     await fs.promises.mkdir('public/images', { recursive: true });
     await fs.promises.writeFile(imagePath, Buffer.from(bufferedImage));
 } catch (err) {
     throw new Error('Saving image failed');
 }

 meal.image = `/images/${fileName}`;
 
 db.prepare(`
    INSERT INTO meals (
        title,
        summary,
        instructions,
        creator_email,
        creator,
        image,
        slug
    ) VALUES (
        @title,
        @summary,
        @instructions,
        @creator_email,
        @creator,
        @image,
        @slug
    )
    `).run(meal);
} 