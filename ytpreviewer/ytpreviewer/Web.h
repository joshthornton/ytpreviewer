//
//  Web.h
//  ytpreviewer
//
//  Created by Josh Thornton on 25/06/12.
//  Copyright (c) 2012 YAP C3 Green. All rights reserved.
//

#include <Foundation/Foundation.h>

@interface Web : NSObject {
    NSArray *words;
}

- (id) init;
- (void) dealloc;
- (void) printWords;

@end
