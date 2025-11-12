// if there is "export" or "import" , the ts file is a module, otherwise , it's a script

// in tsconfig.json, for the file to a be a module by :  "moduleDetection" : force|auto (only apply to ts, not .d.ts)
// declaration file - .d.ts  : can not use runtime code , then import from the filename without 'd.ts'
//  if a .d.ts has "export {}" , then it will be treated as module, not script

// how to use declaration file  to export type from js file  : need "export {}"

// use "declare" to tell this type is available and  without providing an implementation (only local scope, or ambient declaration , not available to other file)  ,  eg.   declare  const DEBUG: {}
// if want it available for multiple files, then can use : declaration file or  declare global
