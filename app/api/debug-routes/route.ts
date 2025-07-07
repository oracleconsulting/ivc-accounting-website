import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const apiDir = path.join(process.cwd(), 'app/api/admin/posts');
  
  try {
    const files = fs.readdirSync(apiDir);
    const idDir = files.find(f => f.includes('id'));
    
    let routeFile: string | undefined = undefined;
    let idDirContents: string[] = [];
    
    if (idDir) {
      const idDirPath = path.join(apiDir, idDir);
      idDirContents = fs.readdirSync(idDirPath);
      routeFile = idDirContents.find(f => f.includes('route'));
    }
    
    // Also check if the new route exists
    const newRoutePath = path.join(process.cwd(), 'app/api/admin/post-by-id');
    const newRouteExists = fs.existsSync(newRoutePath);
    let newRouteContents: string[] = [];
    
    if (newRouteExists) {
      newRouteContents = fs.readdirSync(newRoutePath);
    }
    
    return NextResponse.json({
      apiDirContents: files,
      idDirFound: idDir,
      idDirContents: idDirContents,
      routeFileFound: routeFile,
      newRouteExists: newRouteExists,
      newRouteContents: newRouteContents,
      workingDirectory: process.cwd(),
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error),
      workingDirectory: process.cwd(),
      timestamp: new Date().toISOString()
    });
  }
} 