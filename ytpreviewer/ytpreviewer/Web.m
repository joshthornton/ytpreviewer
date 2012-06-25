//
//  Web.m
//  ytpreviewer
//
//  Created by Josh Thornton on 25/06/12.
//  Copyright (c) 2012 YAP C3 Green. All rights reserved.
//

#import "Web.h"

@implementation Web

- (id)init
{
    self = [super init];
    if (self) {
        words = [NSArray arrayWithObjects:@"Hello,", @"world!", @"Check", @"this", @"out!", nil];
    }
    
    return self;
}

- (void)dealloc
{
    [words release];
    [super dealloc];
}

- (void) printWords {
    NSLog(@"%@", [words componentsJoinedByString:@" "]);
}

@end
