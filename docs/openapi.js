module.exports = {
    openapi: '3.0.3',
    info: {
        title: 'GlucoSense Backend API',
        version: '1.0.0',
        description: 'API documentation for GlucoSense mobile backend'
    },
    servers: [
        {
            url: 'http://localhost:5000',
            description: 'Local development server'
        }
    ],
    tags: [
        { name: 'Health' },
        { name: 'Auth' },
        { name: 'Sensors' },
        { name: 'Readings' },
        { name: 'Insulin' },
        { name: 'Carbs' }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            ErrorResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'ValidationError' },
                    message: { type: 'string', example: 'Invalid request data' }
                }
            },
            User: {
                type: 'object',
                properties: {
                    id: { type: 'string', example: '65f3d8ab1234567890abc123' },
                    email: { type: 'string', format: 'email', example: 'user@example.com' },
                    firstName: { type: 'string', example: 'John' },
                    lastName: { type: 'string', example: 'Doe' },
                    dateOfBirth: { type: 'string', format: 'date-time' },
                    age: { type: 'number', example: 30 },
                    language: { type: 'string', example: 'en' },
                    authProvider: { type: 'string', example: 'email' },
                    emailVerified: { type: 'boolean', example: true },
                    profilePhoto: { type: 'string', nullable: true }
                }
            },
            AuthResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                        type: 'object',
                        properties: {
                            token: { type: 'string' },
                            user: { $ref: '#/components/schemas/User' },
                            isNewUser: { type: 'boolean', example: false }
                        }
                    },
                    message: { type: 'string', example: 'Login successful' }
                }
            },
            RegisterRequest: {
                type: 'object',
                required: ['email', 'password', 'firstName', 'lastName', 'dateOfBirth'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    dateOfBirth: { type: 'string', format: 'date-time' },
                    language: { type: 'string', enum: ['uz', 'ru', 'en'] }
                }
            },
            LoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' }
                }
            },
            SendCodeRequest: {
                type: 'object',
                required: ['email'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    language: { type: 'string', enum: ['uz', 'ru', 'en'], default: 'en' }
                }
            },
            VerifyCodeRequest: {
                type: 'object',
                required: ['email', 'code'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    code: { type: 'string', minLength: 6, maxLength: 6 },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    dateOfBirth: { type: 'string', format: 'date-time' },
                    language: { type: 'string', enum: ['uz', 'ru', 'en'], default: 'en' }
                }
            },
            FirebaseAuthRequest: {
                type: 'object',
                required: ['idToken'],
                properties: {
                    idToken: { type: 'string' },
                    language: { type: 'string', enum: ['uz', 'ru', 'en'], default: 'en' }
                }
            },
            LinkFirebaseRequest: {
                type: 'object',
                required: ['idToken'],
                properties: {
                    idToken: { type: 'string' }
                }
            },
            UpdateProfileRequest: {
                type: 'object',
                properties: {
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    dateOfBirth: { type: 'string', format: 'date-time' },
                    language: { type: 'string', enum: ['uz', 'ru', 'en'] }
                }
            },
            Sensor: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    userId: { type: 'string' },
                    serialNumber: { type: 'string' },
                    connectionCode: { type: 'string' },
                    activatedAt: { type: 'string', format: 'date-time' },
                    isActive: { type: 'boolean' }
                }
            },
            CreateSensorRequest: {
                type: 'object',
                required: ['serialNumber', 'connectionCode'],
                properties: {
                    serialNumber: { type: 'string' },
                    connectionCode: { type: 'string' }
                }
            },
            GlucoseReading: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    userId: { type: 'string' },
                    sensorId: { type: 'string', nullable: true },
                    value: { type: 'number', example: 5.7 },
                    timestamp: { type: 'string', format: 'date-time' },
                    status: { type: 'string', enum: ['low', 'normal', 'high'] }
                }
            },
            CreateReadingRequest: {
                type: 'object',
                required: ['value', 'timestamp'],
                properties: {
                    value: { type: 'number' },
                    timestamp: { type: 'string', format: 'date-time' },
                    sensorId: { type: 'string', nullable: true }
                }
            },
            InsulinLog: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    userId: { type: 'string' },
                    amount: { type: 'number' },
                    type: { type: 'string', enum: ['rapid', 'long'] },
                    timestamp: { type: 'string', format: 'date-time' },
                    notes: { type: 'string', nullable: true }
                }
            },
            CreateInsulinLogRequest: {
                type: 'object',
                required: ['amount', 'type', 'timestamp'],
                properties: {
                    amount: { type: 'number' },
                    type: { type: 'string', enum: ['rapid', 'long'] },
                    timestamp: { type: 'string', format: 'date-time' },
                    notes: { type: 'string' }
                }
            },
            CarbLog: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    userId: { type: 'string' },
                    amount: { type: 'number' },
                    mealType: { type: 'string', enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
                    timestamp: { type: 'string', format: 'date-time' },
                    notes: { type: 'string', nullable: true }
                }
            },
            CreateCarbLogRequest: {
                type: 'object',
                required: ['amount', 'timestamp'],
                properties: {
                    amount: { type: 'number' },
                    mealType: { type: 'string', enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
                    timestamp: { type: 'string', format: 'date-time' },
                    notes: { type: 'string' }
                }
            }
        }
    },
    paths: {
        '/health': {
            get: {
                tags: ['Health'],
                summary: 'Health check',
                responses: {
                    200: {
                        description: 'Server health',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string', example: 'Server is running' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/auth/register': {
            post: {
                tags: ['Auth'],
                summary: 'Register user with email/password',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RegisterRequest' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Registered',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthResponse' }
                            }
                        }
                    },
                    400: {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Login with email/password',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LoginRequest' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Authenticated',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthResponse' }
                            }
                        }
                    },
                    401: {
                        description: 'Authentication error',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/auth/send-code': {
            post: {
                tags: ['Auth'],
                summary: 'Send email verification code',
                description: 'Returns 503 while email code auth is temporarily disabled.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/SendCodeRequest' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Code sent',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                email: { type: 'string', format: 'email' },
                                                expiresIn: { type: 'number' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    503: {
                        description: 'Feature disabled',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/auth/verify-code': {
            post: {
                tags: ['Auth'],
                summary: 'Verify email code and authenticate',
                description: 'Returns 503 while email code auth is temporarily disabled.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/VerifyCodeRequest' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Authenticated',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthResponse' }
                            }
                        }
                    },
                    401: {
                        description: 'Authentication error',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' }
                            }
                        }
                    },
                    503: {
                        description: 'Feature disabled',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/auth/firebase': {
            post: {
                tags: ['Auth'],
                summary: 'Authenticate via Firebase provider token',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/FirebaseAuthRequest' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Authenticated',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthResponse' }
                            }
                        }
                    },
                    401: {
                        description: 'Invalid Firebase token',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/auth/link-firebase': {
            post: {
                tags: ['Auth'],
                summary: 'Link Firebase account to current user',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LinkFirebaseRequest' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Linked',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                user: { $ref: '#/components/schemas/User' }
                                            }
                                        },
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/auth/me': {
            get: {
                tags: ['Auth'],
                summary: 'Get current user profile',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Current user',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                user: { $ref: '#/components/schemas/User' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/auth/profile': {
            patch: {
                tags: ['Auth'],
                summary: 'Update current user profile',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/UpdateProfileRequest' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Profile updated',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                user: { $ref: '#/components/schemas/User' }
                                            }
                                        },
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/sensors': {
            get: {
                tags: ['Sensors'],
                summary: 'Get active sensors',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Sensor list',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                sensors: {
                                                    type: 'array',
                                                    items: { $ref: '#/components/schemas/Sensor' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Sensors'],
                summary: 'Register sensor',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CreateSensorRequest' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Sensor created',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                sensor: { $ref: '#/components/schemas/Sensor' }
                                            }
                                        },
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/sensors/{id}': {
            get: {
                tags: ['Sensors'],
                summary: 'Get sensor by id',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' }
                    }
                ],
                responses: {
                    200: {
                        description: 'Sensor',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                sensor: { $ref: '#/components/schemas/Sensor' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            delete: {
                tags: ['Sensors'],
                summary: 'Deactivate sensor',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' }
                    }
                ],
                responses: {
                    200: {
                        description: 'Sensor deactivated',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                sensor: { $ref: '#/components/schemas/Sensor' }
                                            }
                                        },
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/readings': {
            get: {
                tags: ['Readings'],
                summary: 'Get glucose readings',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'startDate',
                        in: 'query',
                        schema: { type: 'string', format: 'date-time' }
                    },
                    {
                        name: 'endDate',
                        in: 'query',
                        schema: { type: 'string', format: 'date-time' }
                    },
                    {
                        name: 'limit',
                        in: 'query',
                        schema: { type: 'number', default: 100 }
                    }
                ],
                responses: {
                    200: {
                        description: 'Readings list',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                readings: {
                                                    type: 'array',
                                                    items: { $ref: '#/components/schemas/GlucoseReading' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Readings'],
                summary: 'Create glucose reading',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CreateReadingRequest' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Reading created',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                reading: { $ref: '#/components/schemas/GlucoseReading' }
                                            }
                                        },
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/readings/latest': {
            get: {
                tags: ['Readings'],
                summary: 'Get latest reading',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Latest reading',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                reading: { $ref: '#/components/schemas/GlucoseReading' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/readings/chart': {
            get: {
                tags: ['Readings'],
                summary: 'Get chart data for last 24h',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Chart data',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                chartData: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            value: { type: 'number' },
                                                            timestamp: { type: 'string', format: 'date-time' }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/insulin': {
            get: {
                tags: ['Insulin'],
                summary: 'Get insulin logs',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'startDate',
                        in: 'query',
                        schema: { type: 'string', format: 'date-time' }
                    },
                    {
                        name: 'endDate',
                        in: 'query',
                        schema: { type: 'string', format: 'date-time' }
                    },
                    {
                        name: 'limit',
                        in: 'query',
                        schema: { type: 'number', default: 100 }
                    }
                ],
                responses: {
                    200: {
                        description: 'Insulin logs',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                logs: {
                                                    type: 'array',
                                                    items: { $ref: '#/components/schemas/InsulinLog' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Insulin'],
                summary: 'Create insulin log',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CreateInsulinLogRequest' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Insulin log created',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                log: { $ref: '#/components/schemas/InsulinLog' }
                                            }
                                        },
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/insulin/{id}': {
            delete: {
                tags: ['Insulin'],
                summary: 'Delete insulin log',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' }
                    }
                ],
                responses: {
                    200: {
                        description: 'Deleted',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string', example: 'Insulin log deleted successfully' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/carbs': {
            get: {
                tags: ['Carbs'],
                summary: 'Get carb logs',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'startDate',
                        in: 'query',
                        schema: { type: 'string', format: 'date-time' }
                    },
                    {
                        name: 'endDate',
                        in: 'query',
                        schema: { type: 'string', format: 'date-time' }
                    },
                    {
                        name: 'limit',
                        in: 'query',
                        schema: { type: 'number', default: 100 }
                    }
                ],
                responses: {
                    200: {
                        description: 'Carb logs',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                logs: {
                                                    type: 'array',
                                                    items: { $ref: '#/components/schemas/CarbLog' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Carbs'],
                summary: 'Create carb log',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CreateCarbLogRequest' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Carb log created',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                log: { $ref: '#/components/schemas/CarbLog' }
                                            }
                                        },
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/carbs/{id}': {
            delete: {
                tags: ['Carbs'],
                summary: 'Delete carb log',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' }
                    }
                ],
                responses: {
                    200: {
                        description: 'Deleted',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string', example: 'Carb log deleted successfully' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
