//
//  main.m
//  ytpreviewer
//
//  Created by Josh Thornton on 25/06/12.
//  Copyright (c) 2012 YAP C3 Green. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Web.h"

int main(int argc, const char * argv[])
{
        
    Web *web = [[Web alloc] init];
    [web printWords];
    [web dealloc];
    web = nil;
    
    return 0;
}

