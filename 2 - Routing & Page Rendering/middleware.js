import { NextRequest } from "next/server";

export function middleware(request) {
    console.log(request);

    return new NextRequest.next();
}


export const config = {
    matcher : "/news"
}