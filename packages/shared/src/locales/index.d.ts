import en from './en';
import es from './es';
import fr from './fr';
import pt from './pt';
export declare const resources: {
    readonly en: {
        readonly about: {
            certifications: {
                title: string;
                subtitle: string;
                verified: string;
                items: {
                    turismoPortugal: {
                        name: string;
                        description: string;
                        type: string;
                    };
                    iata: {
                        name: string;
                        description: string;
                        type: string;
                    };
                    lre: {
                        name: string;
                        description: string;
                        type: string;
                    };
                };
            };
            company: {
                name: string;
                slogan: string;
            };
            coreValues: {
                mainTitle1: string;
                mainTitle2: string;
                mainSubtitle: string;
                personalization: {
                    title: string;
                    desc: string;
                };
                sustainability: {
                    title: string;
                    desc: string;
                };
                ethicsIntegrity: {
                    title: string;
                    desc: string;
                };
                innovation: {
                    title: string;
                    desc: string;
                };
                clientFocus: {
                    title: string;
                    desc: string;
                };
                community: {
                    title: string;
                    desc: string;
                };
            };
            footer: {
                callNow: string;
                backToTop: string;
                cta: {
                    title: string;
                    subtitle: string;
                    contact: string;
                    explore: string;
                };
            };
            founder: {
                bio1: string;
                quote: string;
                badge1: string;
                badge2: string;
                badge3: string;
                title1: string;
                title2: string;
            };
            hero: {
                title1: string;
                title2: string;
                subtitle: string;
                cta: string;
            };
            mapContact: {
                title: string;
                address: string;
                phone: string;
                email: string;
            };
            partnerships: {
                title1: string;
                title2: string;
                subtitle: string;
                gea: {
                    desc: string;
                };
                sanjotec: {
                    desc: string;
                };
                dgconsulting: {
                    desc: string;
                };
                turismodeportugal: {
                    desc: string;
                };
                officialPartner: string;
            };
            stats: {
                satisfiedClients: string;
                exclusiveDestinations: string;
                satisfactionRate: string;
                supportAvailable: string;
            };
            story: {
                title1: string;
                title2: string;
                subtitle: string;
                visionTitle: string;
                paragraph1: string;
                paragraph2: string;
                ourMission: string;
                missionStatement: string;
                imageAlt: string;
                location: string;
            };
            team: {
                title: string;
                subtitle: string;
                luis: {
                    name: string;
                    status: string;
                    bioTitle: string;
                    role: string;
                    bio: string;
                    fullBio: string;
                    curriculum: string[];
                    contact: string;
                    knowMore: string;
                    experience: string;
                    contactMe: string;
                };
            };
            trust: {
                title1: string;
                title2: string;
                subtitle: string;
            };
            newsletter: {
                title: string;
            };
            mobile: {
                app: {
                    app: string;
                };
            };
            help: {
                documentation: string;
            };
            legal: {
                terms: string;
                privacy: string;
                cookies: string;
                gdpr: string;
                cancellation: string;
            };
        };
        readonly activities: {
            activities: {
                title: string;
                subtitle: string;
                searchPlaceholder: string;
                searchButton: string;
                noActivitiesFound: string;
                errorFetching: string;
                viewOnTripAdvisor: string;
            };
        };
        readonly activity: {
            empty: string;
            title: string;
        };
        readonly admin: {
            accessDenied: string;
            actions: string;
            adminRequired: string;
            ai: {
                serviceStatus: {
                    title: string;
                    description: string;
                };
                results: {
                    chatTitle: string;
                    sentTitle: string;
                    priceTitle: string;
                    anomTitle: string;
                    itinTitle: string;
                };
                resultDisplay: {
                    processingTitle: string;
                    processingDesc: string;
                    successTitle: string;
                    errorTitle: string;
                    completionTimeLabel: string;
                    unknownError: string;
                    testingLabel: string;
                };
                history: {
                    title: string;
                    description: string;
                    noItems: string;
                    clearButton: string;
                    item: {
                        service: string;
                        title: string;
                        time: string;
                        duration: string;
                    };
                };
            };
            all: string;
            analytics: {
                title: string;
                subtitle: string;
                noData: string;
                noDataAvailable: string;
                loadingError: string;
                exporting: string;
                format: string;
                exportCSV: string;
                exportPDF: string;
                tabs: {
                    overview: string;
                    traffic: string;
                    conversion: string;
                    destinations: string;
                };
                kpi: {
                    bookings: string;
                    revenue: string;
                    users: string;
                    conversion: string;
                    avgOrder: string;
                    bounceRate: string;
                    perBooking: string;
                };
            };
            app: {
                name: string;
                version: string;
                "Toggle theme": string;
                "More options": string;
            };
            applyFilters: string;
            auth: string;
            backToLogs: string;
            booking: string;
            breadcrumb: {
                home: string;
                admin: string;
            };
            cancel: string;
            category: string;
            breadcrumbs: {
                admin: string;
                users: string;
                analytics: string;
                dashboard: string;
                bookings: string;
                content: string;
                settings: string;
                reports: string;
                system: string;
            };
            clear: string;
            clearFilters: string;
            close: string;
            collapse: string;
            confirmDeleteLog: string;
            confirmDeleteSelected: string;
            copied: string;
            copyToClipboard: string;
            critical: string;
            dashboard: {
                title: string;
                description: string;
                welcome: string;
                crm: string;
                crm_description: string;
                bookings: string;
                bookings_description: string;
                finances: string;
                finances_description: string;
                account: string;
                account_description: string;
                newsletter: string;
                newsletter_description: string;
                destinations: string;
                destinations_description: string;
                blog: string;
                blog_description: string;
                sustainable_travel: string;
                sustainable_travel_description: string;
                settings: string;
                settings_description: string;
                more: string;
                total_clients: string;
                active_bookings: string;
                monthly_revenue: string;
                conversion_rate: string;
                previous_month: string;
                recent_bookings: string;
                bookings_management: string;
                clients_management: string;
                general_settings: string;
                manage_admin_users: string;
                configure_email_templates: string;
                content_management: string;
                system_settings: string;
                data_backup: string;
                system_logs: string;
                export_data: string;
                activities: string;
                activities_description: string;
                content_hub: string;
                content_hub_description: string;
                financial_dashboard: string;
                financial_dashboard_description: string;
                financialDashboard: string;
                dashboardOverview: string;
                revenueVsExpenses: string;
                profitTrend: string;
                expenseCategories: string;
                totalRevenue: string;
                totalExpenses: string;
                totalProfit: string;
                avgMonthlyProfit: string;
                revenue: string;
                expenses: string;
                profit: string;
                refresh: string;
                export: string;
                account_overview: string;
                account_overview_description: string;
            };
            dateRange: string;
            debug: string;
            delete: string;
            deleteLog: string;
            deleteLogError: string;
            deleteLogsError: string;
            deleteSelected: string;
            destinations: {
                title: string;
                subtitle: string;
                addNew: string;
                refresh: string;
                export: string;
                loading: string;
                loadSuccess: string;
                loadError: string;
                status: {
                    available: string;
                    limited: string;
                    fullybooked: string;
                    unavailable: string;
                };
                stats: {
                    total: string;
                    bookings: string;
                    revenue: string;
                    avgRating: string;
                    featured: string;
                    active: string;
                    totalBookingsDesc: string;
                    totalRevenueDesc: string;
                    totalReviews: string;
                };
                filters: {
                    title: string;
                    clear: string;
                    tabs: {
                        basic: string;
                        advanced: string;
                    };
                    search: string;
                    searchPlaceholder: string;
                    country: string;
                    allCountries: string;
                    category: string;
                    allCategories: string;
                    status: string;
                    allStatus: string;
                    priceRange: string;
                    minRating: string;
                    sortBy: string;
                };
                table: {
                    title: string;
                    page: string;
                    headers: {
                        destination: string;
                        category: string;
                        status: string;
                        price: string;
                        stats: string;
                        actions: string;
                    };
                    empty: string;
                };
                actions: {
                    view: string;
                    clone: string;
                    delete: string;
                    cloneSuccess: string;
                    deleteSuccess: string;
                    bulkDeleteSuccess: string;
                    statusUpdate: string;
                    featuredUpdate: string;
                    addFeatured: string;
                    removeFeatured: string;
                    activate: string;
                    deactivate: string;
                };
                price: {
                    startingFrom: string;
                    perDay: string;
                };
                selection: {
                    count: string;
                    clear: string;
                    delete: string;
                };
                confirmDelete: {
                    title: string;
                    message: string;
                    bulkMessage: string;
                };
            };
            draft: string;
            edit: string;
            enterSearchTerm: string;
            error: string;
            errorLoadingData: string;
            errorOccurred: string;
            expand: string;
            export: string;
            exportAsCSV: string;
            exportAsJSON: string;
            exportError: string;
            exportLogs: string;
            exportSuccess: string;
            failed: string;
            filters: {
                apply: string;
                clear: string;
                search: string;
                status: {
                    all: string;
                    active: string;
                    inactive: string;
                    pending: string;
                    completed: string;
                    cancelled: string;
                };
            };
            financial: {
                title: string;
                dashboardOverview: string;
                revenueVsExpenses: string;
                profitTrend: string;
                expenseCategories: string;
                annualSummary: string;
                totalRevenue: string;
                totalExpenses: string;
                totalProfit: string;
                avgMonthlyProfit: string;
                revenue: string;
                expenses: string;
                profit: string;
                transactions: string;
                noFinancialData: string;
                vsPreviousMonth: string;
                export: string;
                refresh: string;
            };
            footer: {
                adminLabel: string;
                admin: string;
                description: string;
                management: string;
                users: string;
                bookings: string;
                analytics: string;
                settings: string;
                content: string;
                posts: string;
                pages: string;
                media: string;
                newsletters: string;
                ecommerce: string;
                products: string;
                orders: string;
                financial: string;
                destinations: string;
                system: string;
                logs: string;
                maintenance: string;
                backup: string;
                security: string;
                support: string;
                documentation: string;
                supportTech: string;
                privacy: string;
                terms: string;
                quickDashboard: string;
                quickReports: string;
                goTo: string;
                copyrightLabel: string;
                version: string;
                versionLabel: string;
                lastUpdate: string;
                categories: {
                    empresa: string;
                    legal: string;
                    ajuda: string;
                };
                ia: {
                    preferences: string;
                    toggle: string;
                };
            };
            from: string;
            info: string;
            ip: string;
            level: string;
            loading: string;
            logDeleted: string;
            logDetails: string;
            login: {
                welcome: string;
                subtitle: string;
                title: string;
                emailLabel: string;
                emailPlaceholder: string;
                passwordLabel: string;
                passwordPlaceholder: string;
                rememberMe: string;
                forgotPassword: string;
                submit: string;
                submitting: string;
                noAccount: string;
                registerLink: string;
                notAdmin: string;
                backToSite: string;
            };
            logsDeleted: string;
            message: string;
            logo: {
                link: string;
            };
            logout: string;
            mobile_menu: {
                toggle: string;
                title: string;
            };
            navigation: {
                view_site: string;
                main: string;
                management: string;
                system: string;
                dashboard: string;
                analytics: string;
                financial: string;
                users: string;
                bookings: string;
                newsletter: string;
                blog: string;
                messages: string;
                ai_management: string;
                account: string;
                reports: string;
                settings: string;
                security: string;
                system_logs: string;
                maintenance: string;
                technical_support: string;
                help: string;
                modernDashboard: string;
            };
            noDataAvailable: string;
            noLogs: string;
            noLogsFound: string;
            notifications: {
                toggle: string;
                title: string;
                empty: string;
            };
            notificationsMessages: {
                success: string;
                error: string;
                warning: string;
                info: string;
                saved: string;
                deleted: string;
                updated: string;
                created: string;
            };
            pagination: {
                itemsPerPage: string;
                of: string;
                previous: string;
                next: string;
                first: string;
                last: string;
            };
            panelTitle: string;
            payment: string;
            pleaseWait: string;
            recentLogs: string;
            refresh: string;
            register: {
                welcome: string;
                subtitle: string;
                title: string;
                errorTitle: string;
                nameLabel: string;
                namePlaceholder: string;
                emailLabel: string;
                emailPlaceholder: string;
                passwordLabel: string;
                passwordPlaceholder: string;
                confirmPasswordLabel: string;
                confirmPasswordPlaceholder: string;
                submit: string;
                submitting: string;
                haveAccount: string;
                loginLink: string;
                backToSite: string;
                copyright: string;
                validation: {
                    required: string;
                    passwordMismatch: string;
                    success: string;
                    error: string;
                };
            };
            retry: string;
            save: string;
            scheduled: string;
            search: {
                placeholder: string;
                aria_label: string;
                no_results: string;
                suggestion_hint: string;
                results_found: string;
                no_results_suggestion: string;
                category_match: string;
                suggestion: string;
            };
            searchInLogs: string;
            security: string;
            selectAll: string;
            sent: string;
            sidebar: {
                label: string;
                footerAriaLabel: string;
            };
            success: string;
            system: string;
            theme: {
                toggle: string;
                Dark: string;
                Light: string;
                System: string;
                Theme: string;
                Simple: string;
            };
            timestamp: string;
            to: string;
            tryAgain: string;
            user: string;
            userAgent: string;
            users: {
                title: string;
                subtitle: string;
                addUserDesc: string;
                editUserDesc: string;
                addNew: string;
                search: string;
                filters: string;
                deleteSelected: string;
                table: {
                    name: string;
                    email: string;
                    role: string;
                    status: string;
                    lastLogin: string;
                    actions: string;
                    joined: string;
                    showing: string;
                    joinDate: string;
                    password: string;
                    empty: string;
                };
                pagination: {
                    previous: string;
                    next: string;
                };
                roles: {
                    all: string;
                    admin: string;
                    editor: string;
                    viewer: string;
                };
                status: {
                    all: string;
                    active: string;
                    inactive: string;
                    suspended: string;
                };
            };
            users_description: string;
            viewLogDetails: string;
            warning: string;
        };
        readonly 'ai-preferences': {
            common: {
                notSet: string;
                unknown: string;
                cancel: string;
                clear: string;
                minutesShort: string;
                ai: string;
            };
            localModel: {
                specs: {
                    model: string;
                    size: string;
                    context: string;
                    memory: string;
                };
                benefits: {
                    zeroApiCosts: string;
                    completePrivacy: string;
                    offlineCapability: string;
                };
            };
            privacyTrust: {
                features: {
                    localProcessing: {
                        title: string;
                        description: string;
                    };
                    dataPrivacy: {
                        title: string;
                        description: string;
                    };
                    noDataCollection: {
                        title: string;
                        description: string;
                    };
                    offlineCapability: {
                        title: string;
                        description: string;
                    };
                };
                trustIndicators: {
                    zeroApiCosts: string;
                    noRateLimits: string;
                    completeDataOwnership: string;
                    gdprCompliant: string;
                    noThirdPartyDependencies: string;
                    openSourceModel: string;
                };
            };
            advancedSettings: {
                performance: {
                    title: string;
                    description: string;
                    cache: {
                        title: string;
                        description: string;
                        active: string;
                        hitRate: string;
                    };
                };
                dataIntegration: {
                    title: string;
                    description: string;
                };
                integrations: {
                    title: string;
                    description: string;
                    enableRealTimeData: string;
                    enableWeatherIntegration: string;
                    enableCurrencyConversion: string;
                };
                experimental: {
                    title: string;
                    description: string;
                    beta: string;
                    warning: string;
                    notAvailable: string;
                };
                metrics: {
                    title: string;
                    averageResponseTime: string;
                    cacheHitRate: string;
                    successRate: string;
                    totalRequests: string;
                };
                apiStatus: {
                    title: string;
                    openai: string;
                    weather: string;
                    currency: string;
                    connected: string;
                    active: string;
                    inactive: string;
                    error: string;
                    disconnected: string;
                };
            };
            aiPoweredFeatures: {
                profileAnalysis: {
                    title: string;
                    empty: string;
                };
                travelerProfile: {
                    title: string;
                    travelerType: string;
                    primaryInterests: string;
                };
            };
            modelTab: {
                hero: {
                    title: string;
                    subtitle: string;
                };
                sections: {
                    modelSelection: {
                        title: string;
                        subtitle: string;
                    };
                    parameters: {
                        title: string;
                        subtitle: string;
                    };
                    aiFeatures: {
                        title: string;
                        subtitle: string;
                        badge: string;
                    };
                    performance: {
                        title: string;
                        subtitle: string;
                    };
                    dataIntegration: {
                        title: string;
                        subtitle: string;
                    };
                };
                labels: {
                    model: string;
                    temperature: string;
                    maxTokens: string;
                    status: string;
                    configured: string;
                    incomplete: string;
                    setupInProgress: string;
                };
                groups: {
                    coreSettings: string;
                    advanced: string;
                };
            };
            welcome: {
                title: string;
                subtitle: string;
                button: string;
            };
            status: {
                synced: string;
                loading: string;
                syncing: string;
                hasChanges: string;
                unsaved: string;
            };
            import: {
                tooltip: string;
                success: string;
                successDescription: string;
            };
            reset: {
                tooltip: string;
                success: string;
                successDescription: string;
                dialog: {
                    title: string;
                    description: string;
                    confirm: string;
                    cancel: string;
                };
            };
            modes: {
                quickstart: {
                    badge: string;
                    title: string;
                    description: string;
                    skipLink: string;
                };
                guided: {
                    title: string;
                    subtitle: string;
                    quickStartDone: string;
                };
                power: {
                    badge: string;
                    title: string;
                    description: string;
                    backToGuided: string;
                };
            };
            powerMode: {
                title: string;
                description: string;
                reveal: string;
                hide: string;
                features: {
                    analytics: {
                        title: string;
                        description: string;
                    };
                    model: {
                        title: string;
                        description: string;
                    };
                    export: {
                        title: string;
                        description: string;
                    };
                    api: {
                        title: string;
                        description: string;
                    };
                };
            };
            messages: {
                quickStartComplete: string;
            };
            buttons: {
                backToQuickStart: string;
                previous: string;
                next: string;
                submit: string;
            };
            tabs: {
                tripBasics: {
                    label: string;
                    description: string;
                };
                personalization: {
                    label: string;
                    description: string;
                };
                travelPreferences: {
                    label: string;
                    description: string;
                };
                aiBehavior: {
                    label: string;
                    description: string;
                };
                privacy: {
                    label: string;
                    description: string;
                };
                review: {
                    label: string;
                    description: string;
                };
            };
            sections: {
                accessibility: string;
                accessibilityDescription: string;
                dietary: string;
                dietaryDescription: string;
            };
            description: string;
            help: {
                message: string;
                contact: string;
                about: string;
            };
            activities: {
                museums: string;
                gastronomy: string;
                nightlife: string;
                shopping: string;
                watersports: string;
                hiking: string;
                photography: string;
                architecture: string;
                festivals: string;
                nature: string;
                beaches: string;
                mountains: string;
                spa: string;
                adventure: string;
                heritage: string;
                hiking_extra: string;
                nightlife_extra: string;
                shopping_extra: string;
                culinary: string;
            };
            currencies: {
                EUR: string;
                USD: string;
                GBP: string;
                BRL: string;
            };
            errorResetting: string;
            errorSaving: string;
            advanced: {
                title: string;
                description: string;
                comingSoon: string;
                recommendations: {
                    title: string;
                    subtitle: string;
                    enabledLabel: string;
                    featuresTitle: string;
                };
                dataSharing: {
                    title: string;
                    subtitle: string;
                    generalLabel: string;
                    personalizedLabel: string;
                    analyticsLabel: string;
                    marketingLabel: string;
                };
                notifications: {
                    title: string;
                    subtitle: string;
                    enabledLabel: string;
                    channelsLabel: string;
                    typesLabel: string;
                    channelSelected: string;
                    channelNotSelected: string;
                };
                loyalty: {
                    title: string;
                    subtitle: string;
                    noPrograms: string;
                    addButton: string;
                };
            };
            languages: {
                pt: string;
                en: string;
                es: string;
                fr: string;
                de: string;
                it: string;
            };
            loading: string;
            loadingStats: string;
            page: {
                title: string;
                subtitle: string;
            };
            modelSettings: {
                title: string;
                description: string;
                selectedModel: string;
                modelInfo: string;
                maxTokens: string;
                costPerToken: string;
                capabilities: string;
                parameters: {
                    title: string;
                    description: string;
                    temperature: {
                        label: string;
                        description: string;
                    };
                    maxTokensParam: {
                        label: string;
                        description: string;
                    };
                    topP: {
                        label: string;
                        description: string;
                    };
                    frequencyPenalty: {
                        label: string;
                        description: string;
                    };
                    presencePenalty: {
                        label: string;
                        description: string;
                    };
                };
            };
            personalization: {
                personality: {
                    title: string;
                    description: string;
                    personalityType: string;
                    professional: {
                        label: string;
                        description: string;
                        example: string;
                    };
                    friendly: {
                        label: string;
                        description: string;
                        example: string;
                    };
                    enthusiastic: {
                        label: string;
                        description: string;
                        example: string;
                    };
                    detailed: {
                        label: string;
                        description: string;
                        example: string;
                    };
                    concise: {
                        label: string;
                        description: string;
                        example: string;
                    };
                };
                responseLength: {
                    title: string;
                    description: string;
                    short: {
                        label: string;
                        description: string;
                    };
                    medium: {
                        label: string;
                        description: string;
                    };
                    detailed: {
                        label: string;
                        description: string;
                    };
                };
                features: {
                    title: string;
                    description: string;
                    includeLocalTips: string;
                    includeBudgetBreakdown: string;
                    includeAlternatives: string;
                };
                settings: {
                    title: string;
                    description: string;
                    selected: string;
                    selectedType: string;
                    stars: string;
                    dietary: {
                        label: string;
                        none_selected: string;
                        removeAriaLabel: string;
                        options: {
                            vegetarian: string;
                            vegan: string;
                            glutenfree: string;
                            dairyfree: string;
                            nutfree: string;
                            lowcarb: string;
                            cholesterolfree: string;
                        };
                    };
                    pacing: {
                        label: string;
                        placeholder: string;
                        none_selected: string;
                        descriptions: {
                            fast: string;
                            moderate: string;
                            slow: string;
                        };
                        fast: string;
                        moderate: string;
                        slow: string;
                    };
                    accessibility: {
                        label: string;
                        none_selected: string;
                        removeAriaLabel: string;
                        options: {
                            screenreader: string;
                            closedcaptions: string;
                            wheelchair: string;
                        };
                    };
                    accommodation: {
                        label: string;
                        placeholder: string;
                        hotel: string;
                        resort: string;
                        airbnb: string;
                        hostel: string;
                        apartment: string;
                        accessible: string;
                        descriptions: {
                            accommodation: {
                                hotel: string;
                                resort: string;
                                airbnb: string;
                                hostel: string;
                                apartment: string;
                                accessible: string;
                            };
                        };
                        options: {
                            hotel: string;
                            resort: string;
                            airbnb: string;
                            hostel: string;
                            apartment: string;
                            accessible: string;
                        };
                    };
                    cruise: {
                        toggle: {
                            label: string;
                        };
                        hint: string;
                        collapsedHint: string;
                        types: {
                            river: {
                                title: string;
                                subtitle: string;
                            };
                            sea: {
                                title: string;
                                subtitle: string;
                            };
                        };
                        regions: {
                            riverTitle: string;
                            seaTitle: string;
                            options: {
                                european: string;
                                asian: string;
                                african: string;
                                american: string;
                                caribbean: string;
                                mediterranean: string;
                                alaska: string;
                                nordic: string;
                                transatlantic: string;
                            };
                        };
                        duration: {
                            title: string;
                            options: {
                                short: {
                                    label: string;
                                    days: string;
                                };
                                medium: {
                                    label: string;
                                    days: string;
                                };
                                long: {
                                    label: string;
                                    days: string;
                                };
                            };
                        };
                        cabin: {
                            title: string;
                            options: {
                                interior: {
                                    label: string;
                                    description: string;
                                };
                                oceanview: {
                                    label: string;
                                    description: string;
                                };
                                balcony: {
                                    label: string;
                                    description: string;
                                };
                                suite: {
                                    label: string;
                                    description: string;
                                };
                            };
                        };
                    };
                };
            };
            review: {
                ready: string;
                hint: string;
                completeSetup: string;
                modifyLater: string;
                enabled: string;
                disabled: string;
                missing: string;
                complete: string;
                applied: string;
                sections: {
                    basics: {
                        title: string;
                    };
                    personalization: {
                        title: string;
                    };
                    travel: {
                        title: string;
                    };
                    model: {
                        title: string;
                    };
                    privacy: {
                        title: string;
                    };
                };
                fields: {
                    activities: string;
                    budget: string;
                    destination: string;
                    dates: string;
                    travelers: string;
                    model: string;
                    creativity: string;
                    responseLength: string;
                    dataSharing: string;
                    analytics: string;
                    notifications: string;
                };
            };
            preferencesReset: string;
            preferencesSaved: string;
            preferencesUpdated: string;
            privacySettings: {
                title: string;
                description: string;
                saveSearchHistory: string;
                shareDataForImprovement: string;
                allowPersonalization: string;
            };
            restoreDefaults: string;
            saveChanges: string;
            saving: string;
            subtitle: string;
            pageTabs: {
                model: string;
                travel: string;
                personalization: string;
                advanced: string;
                privacy: string;
                analytics: string;
            };
            title: string;
            model: {
                title: string;
                description: string;
                selectedModel: string;
                modelInfo: {
                    title: string;
                };
                maxTokens: string;
                costPerToken: string;
                costWarning: {
                    title: string;
                    message: string;
                };
                resetToDefaults: string;
                status: {
                    available: string;
                    unavailable: string;
                    comingSoon: string;
                };
                estimatedMonthlyCost: string;
                performance: {
                    title: string;
                    speed: string;
                    accuracy: string;
                    creativity: string;
                };
                capabilities: {
                    title: string;
                };
            };
            parameters: {
                title: string;
                description: string;
                temperature: {
                    label: string;
                    description: string;
                    levels: {
                        focused: string;
                        balanced: string;
                        creative: string;
                    };
                };
                maxTokens: {
                    label: string;
                    description: string;
                    words: string;
                };
                topP: {
                    label: string;
                    description: string;
                };
                frequencyPenalty: {
                    label: string;
                    description: string;
                };
                presencePenalty: {
                    label: string;
                    description: string;
                };
                advanced: {
                    title: string;
                };
            };
            travelPreferences: {
                budget: {
                    title: string;
                    description: string;
                    badge: string;
                    currencyLabel: string;
                    currencyPlaceholder: string;
                    rangeLabel: string;
                    maxBudgetPercent: string;
                    info: string;
                    defaultTitle: string;
                    rangeTitle: string;
                    rangeSubtitle: string;
                    amplitude: string;
                    presetAriaLabel: string;
                    minLabel: string;
                    maxLabel: string;
                    minTooltip: string;
                    maxTooltip: string;
                    visualizationTitle: string;
                    minShort: string;
                    available: string;
                    errors: {
                        multipleIssues: string;
                    };
                    presets: {
                        economic: string;
                        balanced: string;
                        premium: string;
                    };
                };
                travelStyle: {
                    title: string;
                    description: string;
                    travelersLabel: string;
                    selector: {
                        title: string;
                        subtitle: string;
                        selected: string;
                        recommendedActivities: string;
                    };
                    types: {
                        luxury: {
                            label: string;
                            description: string;
                        };
                        comfort: {
                            label: string;
                            description: string;
                        };
                        budget: {
                            label: string;
                            description: string;
                        };
                        adventure: {
                            label: string;
                            description: string;
                        };
                        cultural: {
                            label: string;
                            description: string;
                        };
                        relaxation: {
                            label: string;
                            description: string;
                        };
                    };
                    luxury: {
                        label: string;
                        description: string;
                    };
                    comfort: {
                        label: string;
                        description: string;
                    };
                    budget: {
                        label: string;
                        description: string;
                    };
                    adventure: {
                        label: string;
                        description: string;
                    };
                    cultural: {
                        label: string;
                        description: string;
                    };
                    relaxation: {
                        label: string;
                        description: string;
                    };
                };
                sustainability: {
                    title: string;
                    description: string;
                    levelLabel: string;
                    levelDescription: string;
                    ecoLabel: string;
                    ecoDescription: string;
                    infoTooltip: string;
                    certificationsLabel: string;
                    certificationsDescription: string;
                    summaryTitle: string;
                    summaryBody: string;
                    impactLevels: {
                        excellent: string;
                        good: string;
                        moderate: string;
                        tobetter: string;
                    };
                    indicators: {
                        low: string;
                        high: string;
                        score: string;
                    };
                    low: {
                        label: string;
                        description: string;
                        impact: string;
                    };
                    medium: {
                        label: string;
                        description: string;
                        impact: string;
                    };
                    high: {
                        label: string;
                        description: string;
                        impact: string;
                    };
                    ecoPreferencesOptions: {
                        carbon_offsetting: {
                            label: string;
                            description: string;
                        };
                        eco_hotels: {
                            label: string;
                            description: string;
                        };
                        public_transport: {
                            label: string;
                            description: string;
                        };
                        local_food: {
                            label: string;
                            description: string;
                        };
                        wildlife_protection: {
                            label: string;
                            description: string;
                        };
                        water_conservation: {
                            label: string;
                            description: string;
                        };
                        renewable_energy: {
                            label: string;
                            description: string;
                        };
                        zero_waste: {
                            label: string;
                            description: string;
                        };
                    };
                    certificationsOptions: {
                        leed: {
                            label: string;
                            description: string;
                        };
                        green_key: {
                            label: string;
                            description: string;
                        };
                        blue_flag: {
                            label: string;
                            description: string;
                        };
                        earth_check: {
                            label: string;
                            description: string;
                        };
                        green_globe: {
                            label: string;
                            description: string;
                        };
                        eco_label: {
                            label: string;
                            description: string;
                        };
                        none: {
                            label: string;
                            description: string;
                        };
                    };
                };
                travelers: {
                    title: string;
                    description: string;
                };
                activities: {
                    title: string;
                    description: string;
                    addActivity: string;
                    popularActivities: string;
                    selectedLabel: string;
                    clearAll: string;
                    availableLabel: string;
                    limitReached: string;
                    searchPlaceholder: string;
                    limitAlert: string;
                    alreadySelected: string;
                    selectActivity: string;
                    removeActivity: string;
                };
                suggestions: {
                    title: string;
                    available: string;
                    match: string;
                    potentialSavings: string;
                    category: string;
                    moreAvailable: string;
                    footer: string;
                    dismiss: string;
                    sugestion: string;
                };
            };
            usageAnalytics: {
                title: string;
                totalRequests: string;
                tokensUsed: string;
                averageResponseTime: string;
                successRate: string;
                favoriteFeatures: string;
                monthlyUsage: string;
                performanceInsights: string;
                performanceInsightsDescription: string;
                usagePatterns: string;
                mostActiveTime: string;
                preferredDay: string;
                avgSessionDuration: string;
                recommendations: string;
                optimization: string;
                optimizationDesc: string;
                personalization: string;
                personalizationDesc: string;
                achievement: string;
                achievementDesc: string;
                monthlyUsageDescription: string;
                monthlyGrowth: string;
                favoriteFeaturesDescription: string;
            };
            dashboard: {
                intelligenceScore: string;
                configurationSteps: string;
                overallProgress: string;
                scoreCards: {
                    intelligence: {
                        title: string;
                        subtitle: string;
                    };
                    traveler: {
                        title: string;
                        subtitle: string;
                    };
                    sustainability: {
                        title: string;
                        subtitle: string;
                    };
                };
                navigation: {
                    previous: string;
                    continue: string;
                    completeSetup: string;
                };
                auth: {
                    saveTitle: string;
                    saveDescription: string;
                    loginButton: string;
                };
            };
            steps: {
                profile: {
                    label: string;
                    description: string;
                };
                style: {
                    label: string;
                    description: string;
                };
                budget: {
                    label: string;
                    description: string;
                };
                preferences: {
                    label: string;
                    description: string;
                };
                activities: {
                    label: string;
                    description: string;
                };
                accessibility: {
                    label: string;
                    description: string;
                };
                settings: {
                    label: string;
                    description: string;
                };
            };
            languageSelection: {
                title: string;
                selectedTitle: string;
                addLanguage: string;
                chooseLanguage: string;
                noneSelected: string;
                searchPlaceholder: string;
                noResults: string;
                recommendationsTitle: string;
                clickToAdd: string;
                proficiency: string;
                basic: string;
                intermediate: string;
                fluent: string;
                chooseProficiency: string;
            };
            days: {
                monday: string;
                tuesday: string;
                wednesday: string;
                thursday: string;
                friday: string;
                saturday: string;
                sunday: string;
            };
        };
        readonly auth: {
            accessDenied: string;
            back_to_home: string;
            create_account: string;
            email_label: string;
            email_placeholder: string;
            exclusive_trips: string;
            facebook_sign_in: string;
            forgot_password: string;
            google_sign_in: string;
            insufficientPermissions: string;
            invalid_credentials: string;
            login: {
                title: string;
                subtitle: string;
                email: string;
                emailRequired: string;
                invalidEmail: string;
                password: string;
                passwordRequired: string;
                passwordMinLength: string;
                rememberMe: string;
                signIn: string;
                orSignInWithEmail: string;
            };
            loginRequired: string;
            no_account: string;
            or: string;
            password_label: string;
            password_placeholder: string;
            pleaseLoginToContinue: string;
            register: string;
            remember_me: string;
            required_fields: string;
            secure: string;
            sign_in: string;
            signing_in: string;
            subtitle: string;
            success: string;
            support: string;
            unexpected_error: string;
            welcome: string;
        };
        readonly blog: {
            pageTitle: {
                exploring: string;
                tag: string;
                search: string;
                default: string;
            };
            description: string;
            back: string;
            categories: {
                destinations: string;
                "travel-tips": string;
                adventure: string;
                gastronomy: string;
                ecotourism: string;
                culture: string;
                itineraries: string;
                Destinos: string;
                "Dicas de Viagem": string;
                Aventura: string;
                Gastronomia: string;
                Ecoturismo: string;
                Cultura: string;
                Roteiros: string;
            };
            featured: {
                title: string;
                subtitle: string;
                readArticle: string;
            };
            footer: {
                copyright: string;
                terms: string;
                privacy: string;
            };
            hero: {
                badge: string;
                title: string;
                subtitle: string;
            };
            loadMore: string;
            meta: {
                title: string;
                description: string;
                keywords: string;
            };
            posts: {
                title: string;
                readMore: string;
                readTime: string;
                backToBlog: string;
                resultsFound: string;
                noResults: {
                    title: string;
                    description: string;
                };
            };
            relatedDestinations: string;
            relatedPosts: string;
            relatedServices: string;
            search: {
                placeholder: string;
                allCategories: string;
            };
            sidebar: {
                recentPosts: string;
                newsletter: {
                    title: string;
                    description: string;
                    placeholder: string;
                    subscribe: string;
                    success: string;
                    error: string;
                };
            };
            filtersPanel: {
                title: string;
                clear: string;
                search: {
                    label: string;
                    placeholder: string;
                };
                category: {
                    label: string;
                    placeholder: string;
                };
                tag: {
                    label: string;
                    placeholder: string;
                };
                sort: {
                    label: string;
                    options: {
                        recent: string;
                        popular: string;
                        az: string;
                        za: string;
                    };
                };
                updating: string;
            };
            searchAndFilter: {
                search: {
                    placeholder: string;
                    submit: string;
                };
            };
            newsletterInline: {
                title: string;
                description: string;
                emailPlaceholder: string;
                subscribe: string;
            };
            popularCategories: {
                title: string;
                items: {
                    beaches: string;
                    ecotourism: string;
                    gastronomy: string;
                    culture: string;
                    adventure: string;
                };
            };
            grid: {
                range: {
                    empty: string;
                    showing: string;
                };
                noResults: {
                    title: string;
                    titleWithQuery: string;
                    description: string;
                    descriptionWithQuery: string;
                    viewAll: string;
                };
                activeFilters: {
                    category: string;
                    tag: string;
                    search: string;
                    clearAll: string;
                };
                pagination: {
                    previous: string;
                    next: string;
                    page: string;
                };
            };
            article: {
                actions: {
                    viewAll: string;
                };
                loadError: {
                    title: string;
                    description: string;
                };
                content: {
                    unavailable: string;
                    loading: string;
                };
                footer: {
                    lastUpdated: string;
                };
                meta: {
                    readingTimeMinutes: string;
                    siteNameFallback: string;
                    fallbackDescription: string;
                    fallbackOpenGraphTitle: string;
                    fallbackOpenGraphDescription: string;
                    twitterHandleFallback: string;
                    notFoundTitle: string;
                };
            };
        };
        readonly booking: {
            buttons: {
                back: string;
                continue: string;
                confirm: string;
            };
            destinations: {
                santorini: {
                    name: string;
                    duration: string;
                    includes: string[];
                };
                tokyo: {
                    name: string;
                    duration: string;
                    includes: string[];
                };
                bali: {
                    name: string;
                    duration: string;
                    includes: string[];
                };
            };
            pageTitle: string;
            perPersonSuffix: string;
            step1: {
                title: string;
                departureDate: string;
                returnDate: string;
                travelers: string;
                travelerCount_one: string;
                travelerCount_other: string;
                accommodation: {
                    title: string;
                    options: {
                        standard: string;
                        premium: string;
                        luxury: string;
                    };
                    pricePrefix: string;
                    included: string;
                };
                specialRequests: {
                    label: string;
                    placeholder: string;
                };
            };
            step2: {
                title: string;
                fullName: string;
                fullNamePlaceholder: string;
                email: string;
                emailPlaceholder: string;
                phone: string;
                phonePlaceholder: string;
                document: string;
                documentPlaceholder: string;
                security: {
                    title: string;
                    description: string;
                };
            };
            step3: {
                title: string;
                travelerCount_one: string;
                travelerCount_other: string;
                rating: string;
                priceDetails: {
                    title: string;
                    basePackage: string;
                    accommodationUpgrade: string;
                    taxes: string;
                };
                included: {
                    title: string;
                    travelInsurance: string;
                    support: string;
                };
                policies: {
                    title: string;
                    cancellation: string;
                    changes: string;
                    documentation: string;
                    vaccines: string;
                };
                total: string;
            };
            step4: {
                title: string;
                paymentMethod: {
                    title: string;
                    credit: {
                        name: string;
                        description: string;
                    };
                    pix: {
                        name: string;
                        description: string;
                    };
                };
                creditCard: {
                    number: string;
                    numberPlaceholder: string;
                    expiry: string;
                    expiryPlaceholder: string;
                    cvv: string;
                    cvvPlaceholder: string;
                    name: string;
                    namePlaceholder: string;
                };
                pix: {
                    title: string;
                    description: string;
                    totalWithDiscount: string;
                };
                terms: {
                    agree: string;
                    service: string;
                    privacy: string;
                };
                orderSummary: {
                    title: string;
                    subtotal: string;
                    taxes: string;
                    pixDiscount: string;
                    securePayment: string;
                    instantConfirmation: string;
                };
            };
        };
        readonly bookings: {
            bookNow: string;
            getStarted: string;
            noBookings: string;
            subtitle: string;
            title: string;
        };
        readonly careers: {
            hero: {
                title: string;
                subtitle: string;
                badge: string;
            };
            benefits: {
                title: string;
                health: string;
                health_desc: string;
                flex: string;
                flex_desc: string;
                growth: string;
                growth_desc: string;
                tech: string;
                tech_desc: string;
            };
            cta: {
                badge: string;
                title: string;
                subtitle: string;
                button: string;
            };
            form: {
                title: string;
            };
            application: {
                title: string;
                close: string;
                name: string;
                email: string;
                phone: string;
                linkedin: string;
                message: {
                    label: string;
                    placeholder: string;
                };
                cv: {
                    label: string;
                    upload: string;
                    drag: string;
                    format: string;
                };
                error: string;
                submitting: string;
                submit: string;
                success: {
                    title: string;
                    message: string;
                };
            };
            job: {
                none: string;
                checkback: string;
                spontaneous: string;
                apply: {
                    label: string;
                    aria: string;
                };
                requirements_label: string;
                benefits_label: string;
            };
            jobs: {
                empty: {
                    title: string;
                    department: string;
                    general: string;
                    checkback: string;
                };
            };
            departments: {
                empty: {
                    title: string;
                    subtitle: string;
                };
            };
            open_positions: string;
            opportunities: string;
            sections: {
                whyJoinUs: {
                    title: string;
                    description: string;
                };
                openPositions: {
                    title: string;
                    noPositions: string;
                };
            };
        };
        readonly chat: {
            cancelClose: string;
            collapseTopics: string;
            confirmClose: string;
            conversationClosed: string;
            expandTopics: string;
            inputPlaceholder: string;
            notificationsDisabled: string;
            openChat: string;
            selectTopic: string;
            talkToUs: string;
            title: string;
            welcome: string;
            welcomeMessage: string;
        };
        readonly common: {
            tryAgain: string;
            close: string;
            actions: string;
            slogan: string;
            phone: string;
            email: string;
            address: {
                city: string;
                street: string;
            };
            ui: {
                edit: string;
                loading: string;
                error: string;
                retry: string;
                close: string;
                save: string;
                cancel: string;
                confirm: string;
                delete: string;
                view: string;
                show: string;
                show_less: string;
                show_more: string;
                hide: string;
                add: string;
                remove: string;
                create: string;
                update: string;
                submit: string;
                search: string;
                select: string;
                choose: string;
                book: string;
                join: string;
                overview: string;
                notAvailable: string;
                emailPlaceholder: string;
            };
            available: string;
            booking: string;
            searching: string;
            day: string;
            days: string;
            roundTrip: string;
            returnDate: string;
            admin: {
                actions: string;
                edit: string;
                dashboard: string;
                users: string;
                settings: string;
                blog: {
                    title: string;
                    posts: string;
                    create_post: string;
                    title_placeholder: string;
                    content_placeholder: string;
                    draft: string;
                    published: string;
                    create: string;
                    existing_posts: string;
                    slug: string;
                    date: string;
                    status: string;
                };
                social: {
                    posts: string;
                    create_post: string;
                    content_placeholder: string;
                    schedule: string;
                    existing_posts: string;
                    platform: string;
                    content: string;
                    scheduled_date: string;
                    status: string;
                };
                sustainable_travel: {
                    title: string;
                    page_content: string;
                    add_initiative: string;
                    hero_title: string;
                    hero_description: string;
                    mission_statement: string;
                    initiatives: string;
                    initiative_title: string;
                    initiative_description: string;
                };
                routeTransition: {
                    loading: string;
                };
            };
            auth: {
                login: string;
                register: string;
            };
            buttons: {
                getStarted: string;
            };
            cancel: string;
            company: {
                founder: string;
                founderAlt: string;
                founderTitle: string;
                slogan: string;
                name: string;
                address: string;
                phone: string;
                email: string;
            };
            companyInfo: {
                name: string;
                slogan: string;
                address: string;
                phone: string;
            };
            delete: string;
            dismiss: string;
            edit: string;
            explore_now: string;
            featured: string;
            form: {
                activities: string;
                additionalInfo: string;
                budget: string;
                dates: string;
                destinations: string;
                dietary: string;
                duration: string;
                email: string;
                groupSize: string;
                name: string;
                personalInfo: string;
                phone: string;
                specialRequests: string;
                submit: string;
                travelStyle: string;
            };
            high: string;
            learnMore: string;
            loading: string;
            low: string;
            medium: string;
            newsletter: {
                stayUpdated: string;
                dealsAndNews: string;
                description: string;
                emailLabel: string;
                emailPlaceholder: string;
                subscribeButton: string;
                title: string;
            };
            partnerships: {
                title: string;
                dg: string;
                gea: string;
                sanjotec: string;
                turismodeportugal: string;
            };
            paymentMethods: {
                transfer: string;
            };
            profile: {
                account_menu: string;
                profile: string;
                logout: string;
                logout_success: string;
                personal: string;
                contact: string;
                preferences: string;
                payment: string;
                privacy: string;
                title: string;
                description: string;
                edit: string;
                newsletter: {
                    title: string;
                    subtitle: string;
                };
                buttons: {
                    newCampaign: string;
                    refreshList: string;
                };
                stats: {
                    totalSubscribers: string;
                    activeSubscribers: string;
                    totalCampaigns: string;
                    sentCampaigns: string;
                    avgOpenRate: string;
                    avgOpenRateDesc: string;
                };
                tabs: {
                    campaigns: string;
                    subscribers: string;
                    templates: string;
                    analytics: string;
                };
                tableHeaders: {
                    subject: string;
                    status: string;
                    recipients: string;
                    sentAt: string;
                    openRate: string;
                    createdAt: string;
                    email: string;
                    name: string;
                    language: string;
                    tags: string;
                    actions: string;
                };
                subscribers: {
                    title: string;
                    description: string;
                    searchPlaceholder: string;
                    noData: string;
                };
                templates: {
                    title: string;
                    description: string;
                };
                analytics: {
                    title: string;
                    description: string;
                };
                completeness: string;
                complete: string;
                email_verified: string;
                phone_not_verified: string;
                personal_data: string;
                personal_data_description: string;
                first_name: string;
                last_name: string;
                email: string;
                phone: string;
                date_of_birth: string;
                nationality: string;
                tax_id: string;
                gender: string;
                male: string;
                female: string;
                other: string;
                prefer_not_to_say: string;
                marital_status: string;
                single: string;
                married: string;
                divorced: string;
                widowed: string;
                address: string;
                address_description: string;
                street: string;
                number: string;
                complement: string;
                neighborhood: string;
                city: string;
                state: string;
                postal_code: string;
                country: string;
                travel_preferences: string;
                travel_preferences_description: string;
                preferred_currency: string;
                euro: string;
                us_dollar: string;
                british_pound: string;
                brazilian_real: string;
                preferred_language: string;
                portuguese: string;
                english: string;
                spanish: string;
                french: string;
                payment_methods: string;
                payment_methods_description: string;
                no_payment_methods: string;
                add_payment_method: string;
                add_payment_method_button: string;
                privacy_settings: string;
                privacy_settings_description: string;
                profile_visibility: string;
                show_email: string;
                show_email_description: string;
                show_phone: string;
                show_phone_description: string;
                show_address: string;
                show_address_description: string;
                notifications: string;
                marketing_emails: string;
                marketing_emails_description: string;
                sms_notifications: string;
                sms_notifications_description: string;
                push_notifications: string;
                push_notifications_description: string;
                data_sharing: string;
                share_data_with_partners: string;
                share_data_with_partners_description: string;
            };
            save: string;
            search: string;
            smartForm: {
                title: string;
                subtitle: string;
                success: {
                    title: string;
                    message: string;
                    button: string;
                };
                fields: {
                    destination: string;
                    dateFrom: string;
                    dateTo: string;
                    travelers: string;
                    travelType: string;
                    budget: string;
                    name: string;
                    phone: string;
                    email: string;
                    message: string;
                };
                placeholders: {
                    destination: string;
                    travelers: string;
                    travelType: string;
                    budget: string;
                    name: string;
                    phone: string;
                    email: string;
                    message: string;
                };
                errors: {
                    nameRequired: string;
                    emailRequired: string;
                    emailInvalid: string;
                    phoneRequired: string;
                    destinationRequired: string;
                    travelTypeRequired: string;
                    budgetRequired: string;
                };
                reset: string;
                submit: string;
                submitting: string;
            };
            socialMediaTitle: string;
            socials: {
                facebookUrl: string;
                instagramUrl: string;
                twitterUrl: string;
            };
            submit: string;
            header: {
                brand: string;
                tagline: string;
                menu: string;
                notifications: string;
                profile: string;
                settings: string;
                billing: string;
                help: string;
                login: string;
                logout: string;
                user: string;
            };
            theme: {
                dark: string;
                light: string;
                toggleTitle: string;
                moreOptions: string;
                toggleAriaLabel: string;
                switchToDark: string;
                toggle: string;
            };
            viewAll: string;
            nav: {
                destinations: string;
                flights: string;
                hotels: string;
                community: string;
                demo: string;
            };
            legal: {
                terms: string;
                privacy: string;
                cookies: string;
                gdpr: string;
                cancellation: string;
            };
            mobile: {
                app: string;
            };
            help: {
                documentation: string;
            };
        };
        readonly community: {
            tabs: {
                posts: string;
                trips: string;
                events: string;
            };
            errors: {
                like_failed: string;
                try_again: string;
                join_failed: string;
                post_create_failed: string;
            };
            success: {
                joined_trip: string;
            };
            actions: {
                retry: string;
                like: string;
                comment: string;
                share: string;
                save: string;
                report: string;
                follow: string;
                unfollow: string;
                edit: string;
                delete: string;
            };
            hero: {
                title: string;
                subtitle: string;
            };
            notifications: {
                title: string;
                markAllRead: string;
                noNotifications: string;
                newPost: string;
                newComment: string;
                newFollower: string;
                eventReminder: string;
                challengeUpdate: string;
            };
            profile: {
                posts: string;
                followers: string;
                following: string;
                joinedDate: string;
                location: string;
                bio: string;
                travelStats: string;
                countriesVisited: string;
                tripsCompleted: string;
                badges: string;
            };
            sections: {
                feed: {
                    title: string;
                    createPost: string;
                    placeholder: string;
                    postButton: string;
                    noContent: string;
                };
                categories: {
                    title: string;
                    general: string;
                    all: string;
                    experiences: string;
                    tips: string;
                    photos: string;
                    reviews: string;
                    questions: string;
                    recommendations: string;
                    stories: string;
                    dev: string;
                    help: string;
                };
                posts: {
                    title: string;
                    traveler_fallback: string;
                    explorer_fallback: string;
                    recent_interaction: string;
                    view_linked_trip: string;
                    likes_count: string;
                    liked: string;
                    like: string;
                    comment_count: string;
                    back: string;
                    no_results: string;
                };
                cta: {
                    title: string;
                    description: string;
                    create_trip: string;
                    explore_posts: string;
                };
                trending: {
                    title: string;
                    destinations: string;
                    discussions: string;
                    members: string;
                };
                groups: {
                    title: string;
                    joinGroup: string;
                    createGroup: string;
                    myGroups: string;
                    discover: string;
                    members: string;
                    posts: string;
                };
                events: {
                    title: string;
                    upcoming: string;
                    past: string;
                    createEvent: string;
                    joinEvent: string;
                    interested: string;
                    going: string;
                    date: string;
                    location: string;
                    attendees: string;
                };
                leaderboard: {
                    title: string;
                    topContributors: string;
                    mostActive: string;
                    points: string;
                    contributions: string;
                };
                challenges: {
                    title: string;
                    active: string;
                    completed: string;
                    participate: string;
                    reward: string;
                    deadline: string;
                };
            };
        };
        readonly consent: {
            banner: {
                title: string;
                description: string;
                acceptAll: string;
                rejectAll: string;
                customize: string;
                necessary: string;
            };
            categories: {
                necessary: {
                    name: string;
                    description: string;
                    examples: {
                        session: string;
                        security: string;
                        cart: string;
                    };
                };
                functional: {
                    name: string;
                    description: string;
                    examples: {
                        language: string;
                        theme: string;
                        preferences: string;
                    };
                };
                analytics: {
                    name: string;
                    description: string;
                    examples: {
                        usage: string;
                        performance: string;
                        errors: string;
                    };
                };
                marketing: {
                    name: string;
                    description: string;
                    examples: {
                        ads: string;
                        social: string;
                        retargeting: string;
                    };
                };
            };
            legal: {
                learnMore: string;
                privacyPolicy: string;
                cookiePolicy: string;
                dataRetention: string;
            };
            modal: {
                title: string;
                description: string;
                save: string;
                cancel: string;
                acceptAll: string;
                rejectAll: string;
            };
            preferences: {
                title: string;
                lastUpdated: string;
                change: string;
                export: string;
                delete: string;
            };
        };
        readonly contact: {
            contactInfo: {
                items: {
                    icon: string;
                    title: string;
                    details: string[];
                }[];
            };
            faq: {
                title: string;
                subtitle: string;
                items: {
                    question: string;
                    answer: string;
                }[];
            };
            form: {
                title: string;
                subtitle: string;
                fields: {
                    name: {
                        label: string;
                        placeholder: string;
                    };
                    email: {
                        label: string;
                        placeholder: string;
                    };
                    phone: {
                        label: string;
                        placeholder: string;
                    };
                    travelType: {
                        label: string;
                        placeholder: string;
                    };
                    subject: {
                        label: string;
                        placeholder: string;
                    };
                    message: {
                        label: string;
                        placeholder: string;
                    };
                };
                travelTypes: {
                    value: string;
                    label: string;
                }[];
                submitButton: string;
                submittingText: string;
                privacyNotice: string;
                success: {
                    title: string;
                    message: string;
                };
            };
            hero: {
                badge: string;
                title: string;
                subtitle: string;
            };
            map: {
                title: string;
                subtitle: string;
            };
            quickActions: {
                title: string;
                chat: string;
                call: string;
                schedule: string;
            };
            testimonials: {
                title: string;
                subtitle: string;
                items: {
                    name: string;
                    location: string;
                    rating: number;
                    comment: string;
                }[];
            };
        };
        readonly cruises: {
            destinations: {
                caribbean: string;
                caribbean_desc: string;
                mediterranean: string;
                mediterranean_desc: string;
                alaska: string;
                alaska_desc: string;
                norway: string;
                norway_desc: string;
            };
            hero: {
                title: string;
                subtitle: string;
            };
            popularDestinations: {
                title: string;
                subtitle: string;
            };
            search: {
                destination: string;
                destination_placeholder: string;
                date: string;
                cruise_line: string;
                cruise_line_placeholder: string;
                button: string;
            };
            whyChooseUs: {
                title: string;
                subtitle: string;
                exclusive: string;
                exclusive_desc: string;
                luxury: string;
                luxury_desc: string;
                support: string;
                support_desc: string;
            };
        };
        readonly dashboard: {
            dashboard: {
                title: string;
                subtitle: string;
                upcomingTrips: string;
                noUpcomingTrips: string;
                recentBookings: string;
                noRecentBookings: string;
                recommendations: string;
                noRecommendations: string;
            };
        };
        readonly demo: {
            meta: {
                title: string;
                description: string;
            };
            hero: {
                badge: string;
                title: string;
                titleHighlight: string;
                subtitle: string;
                cta: string;
                ctaSecondary: string;
                privacyNote: string;
            };
            flow: {
                title: string;
                subtitle: string;
                phases: {
                    landing: string;
                    preferences: string;
                    searching: string;
                    results: string;
                };
                phaseDescriptions: {
                    landing: string;
                    preferences: string;
                    searching: string;
                    results: string;
                };
            };
            tabs: {
                basics: {
                    title: string;
                    description: string;
                    details: string[];
                };
                budget: {
                    title: string;
                    description: string;
                    details: string[];
                };
                personalization: {
                    title: string;
                    description: string;
                    details: string[];
                };
                sustainability: {
                    title: string;
                    description: string;
                    details: string[];
                };
                model: {
                    title: string;
                    description: string;
                    details: string[];
                };
                privacy: {
                    title: string;
                    description: string;
                    details: string[];
                };
                review: {
                    title: string;
                    description: string;
                    details: string[];
                };
            };
            search: {
                title: string;
                subtitle: string;
                processing: string;
                analyzing: string;
                matching: string;
                complete: string;
                localBadge: string;
                noDataLeaves: string;
            };
            privacy: {
                sectionTitle: string;
                sectionSubtitle: string;
                localLlm: {
                    title: string;
                    description: string;
                };
                noCloud: {
                    title: string;
                    description: string;
                };
                encrypted: {
                    title: string;
                    description: string;
                };
                openSource: {
                    title: string;
                    description: string;
                };
                yourData: {
                    title: string;
                    description: string;
                };
                gdpr: {
                    title: string;
                    description: string;
                };
            };
            features: {
                sectionTitle: string;
                sectionSubtitle: string;
                aiPowered: {
                    title: string;
                    description: string;
                };
                multiTab: {
                    title: string;
                    description: string;
                };
                ecoConscious: {
                    title: string;
                    description: string;
                };
                modelChoice: {
                    title: string;
                    description: string;
                };
                privacyFirst: {
                    title: string;
                    description: string;
                };
                smartSearch: {
                    title: string;
                    description: string;
                };
            };
            cta: {
                title: string;
                subtitle: string;
                button: string;
                footnote: string;
            };
            common: {
                step: string;
                of: string;
                next: string;
                back: string;
                startOver: string;
                learnMore: string;
            };
        };
        readonly destinations: {
            allDestinations: string;
            amazing: string;
            contactUsButton: string;
            contactUsForMoreInfo: string;
            destination1Description: string;
            destination1Name: string;
            destination2Description: string;
            destination2Name: string;
            destinationsFound: string;
            destinationsTitle: string;
            discoverUniquePlaces: string;
            exploreTheWorld: string;
            featuredDestinations: string;
            mostSoughtAfter: string;
            noDestinationsFound: string;
            ourServices: string;
            readyToExplore: string;
            searchDestinations: string;
            selectContinent: string;
            selectPriceRange: string;
            service1Description: string;
            service1Name: string;
            service2Description: string;
            service2Name: string;
            tryAdjustingFilters: string;
            page: {
                featured: {
                    editorialLabel: string;
                    title: string;
                };
                results: {
                    showingPrefix: string;
                    of: string;
                    destinations: string;
                };
                countries: {
                    label: string;
                    more: string;
                };
                filters: {
                    title: string;
                };
                newsletter: {
                    eyebrow: string;
                    title: string;
                    description: string;
                };
            };
        };
        readonly errors: {
            en: {
                "404": string;
                "500": string;
                unauthorized: string;
                forbidden: string;
                notFound: string;
                internalServerError: string;
                notImplemented: string;
                badGateway: string;
                "Server Error": string;
                "Service Unavailable": string;
            };
        };
        readonly faq: {
            answers: {
                bp_howToBook: string;
                bp_paymentMethods: string;
                bp_installments: string;
                cc_policy: string;
                cc_canIChange: string;
                dt_passport: string;
                dt_visa: string;
                dt_travelInsurance: string;
                dt_healthRequirements: string;
                ds_popularDestinations: string;
                ds_customPackages: string;
                ds_groupTravel: string;
                ds_localGuides: string;
                lc_agencyObligations: string;
                lc_travelerRights: string;
                lc_complaints: string;
                lc_rnavt: string;
                sc_contactMethods: string;
                sc_emergencySupport: string;
                sc_responseTime: string;
                sc_languages: string;
            };
            categories: {
                bookingPayment: string;
                cancellationsChanges: string;
                documentationTravel: string;
                destinationsServices: string;
                legalCompliance: string;
                supportContacts: string;
            };
            contactDetails: {
                phone: string;
                email: string;
            };
            hero: {
                title: string;
                subtitle: string;
            };
            linkTexts: {
                lre: string;
            };
            noResults: string;
            notFound: {
                title: string;
                description: string;
                contactUs: string;
            };
            questions: {
                bp_howToBook: string;
                bp_paymentMethods: string;
                bp_installments: string;
                cc_policy: string;
                cc_canIChange: string;
                dt_passport: string;
                dt_visa: string;
                dt_travelInsurance: string;
                dt_healthRequirements: string;
                ds_popularDestinations: string;
                ds_customPackages: string;
                ds_groupTravel: string;
                ds_localGuides: string;
                lc_agencyObligations: string;
                lc_travelerRights: string;
                lc_complaints: string;
                lc_rnavt: string;
                sc_contactMethods: string;
                sc_emergencySupport: string;
                sc_responseTime: string;
                sc_languages: string;
            };
            searchPlaceholder: string;
        };
        readonly features: {
            categories: {
                core: string;
                advanced: string;
                premium: string;
            };
            cta: {
                title: string;
                subtitle: string;
            };
            features: {
                aiPlanning: {
                    title: string;
                    description: string;
                };
                secureBooking: {
                    title: string;
                    description: string;
                };
                globalDestinations: {
                    title: string;
                    description: string;
                };
                community: {
                    title: string;
                    description: string;
                };
                analytics: {
                    title: string;
                    description: string;
                };
            };
            subtitle: string;
            title: string;
        };
        readonly flights: {
            booking: {
                title: string;
                description: string;
                flightDetails: string;
                passengerInfo: string;
                name: string;
                email: string;
                phone: string;
                totalPrice: string;
                confirm: string;
                cancel: string;
                bookingSuccess: string;
                bookingError: string;
            };
            contactCta: {
                title: string;
                description: string;
                cta: string;
            };
            flightTypes: {
                title: string;
                subtitle: string;
                international: {
                    title: string;
                    description: string;
                };
                domestic: {
                    title: string;
                    description: string;
                };
                group: {
                    title: string;
                    description: string;
                };
                learnMore: string;
            };
            flights: {
                popular: {
                    newYork: string;
                    london: string;
                    paris: string;
                    tokyo: string;
                };
            };
            hero: {
                title: string;
                subtitle: string;
                description: string;
            };
            popularFlights: {
                title: string;
                subtitle: string;
            };
            results: {
                title: string;
                noResults: string;
                tryDifferentSearch: string;
                loadingFlights: string;
                flightsFound: string;
                airline: string;
                departure: string;
                arrival: string;
                duration: string;
                stops: string;
                price: string;
                action: string;
                bookNow: string;
                direct: string;
                oneStop: string;
                multipleStops: string;
            };
            search: {
                title: string;
                origin: string;
                originPlaceholder: string;
                destination: string;
                destinationPlaceholder: string;
                selectDate: string;
                passenger: string;
                passengersPlural: string;
                clear: string;
                departure: string;
                departurePlaceholder: string;
                arrival: string;
                arrivalPlaceholder: string;
                departureDate: string;
                returnDate: string;
                passengers: string;
                button: string;
                searching: string;
                roundTrip: string;
                oneWay: string;
            };
        };
        readonly voos: {
            hero: {
                titulo: string;
                subtitulo: string;
                cta: string;
            };
            pesquisa: {
                idaeVolta: string;
                soIda: string;
                tipoLabel: string;
                de: string;
                para: string;
                partida: string;
                regresso: string;
                passageirosLabel: string;
                passageiro_one: string;
                passageiro_other: string;
                procurar: string;
                aProcurar: string;
                incluirAeroportos: string;
                apenasDiretos: string;
                incluirHotel: string;
                selecionarOrigem: string;
                selecionarDestino: string;
            };
            caracteristicas: {
                titulo: string;
                subtitulo: string;
                badgeDestaque: string;
                coberturaGlobal: string;
                coberturaGlobalDesc: string;
                reservaSegura: string;
                reservaSeguraDesc: string;
                pagamentosFlexiveis: string;
                pagamentosFlexiveisDesc: string;
                suporte24h: string;
                suporte24hDesc: string;
                confortoBordo: string;
                confortoBordoDesc: string;
                bagagemGenerosa: string;
                bagagemGenerosaDesc: string;
                programaFidelidade: string;
                programaFidelidadeDesc: string;
                melhoresPrecos: string;
                melhoresPrecosDesc: string;
                saibaMais: string;
                pronto: string;
                botaoBuscar: string;
            };
            faq: {
                titulo: string;
                subtitulo: string;
                pergunta1: string;
                resposta1: string;
                pergunta2: string;
                resposta2: string;
                pergunta3: string;
                resposta3: string;
                pergunta4: string;
                resposta4: string;
            };
            resultados: {
                titulo: string;
                aeroportosProximos: string;
                apenasDiretos: string;
                direto: string;
                paragens: string;
                nenhumVoo: string;
                tentarNovamente: string;
                erroDuffel: string;
                classeEconomica: string;
                origem: string;
                destino: string;
                duracao: string;
                preco: string;
                porPassageiro: string;
                classificacao: string;
                selecionado: string;
                selecionar: string;
                opcoesHotel: string;
                aProcurarHoteis: string;
                nenhumHotel: string;
                reservarHotel: string;
                avaliacoes: string;
                porNoite: string;
                airlineFallback: string;
            };
            reserva: {
                confirmarTitulo: string;
                fechar: string;
                classeEconomica: string;
                origem: string;
                destino: string;
                duracao: string;
                passageirosLabel: string;
                passageiro_one: string;
                passageiro_other: string;
                tipoViagem: string;
                idaeVolta: string;
                sóIda: string;
                caracteristicas: string;
                precoTotal: string;
                cancelar: string;
                confirmar: string;
                aConfirmar: string;
            };
            page: {
                badge: string;
                benefits: {
                    secureBooking: string;
                    fastComparison: string;
                    dedicatedSupport: string;
                };
                searchShell: {
                    eyebrow: string;
                    title: string;
                    description: string;
                };
                openMaps: {
                    title: string;
                    description: string;
                };
            };
            duffel: {
                title: string;
                subtitle: string;
                searchResults: string;
                flightCardTitle: string;
                airlineFallback: string;
                totalPrice: string;
                directFlight: string;
                flightWithStops: string;
                aircraft: string;
                flightLabel: string;
                cabinClassSuffix: string;
                noFlightsFound: string;
                loading: string;
                errorTitle: string;
                notAvailable: string;
            };
        };
        readonly footer: {
            allRightsReserved: string;
            byTravelers: string;
            categories: {
                empresa: string;
                legal: string;
                ajuda: string;
                suporte: string;
                integrações: string;
            };
            company: {
                title: string;
                careers: string;
                press: string;
                sustainableTravel: string;
            };
            complaints: {
                title: string;
                tooltip: string;
                alt: string;
                entity: string;
            };
            cookies: string;
            description: string;
            followOn: string;
            guest: {
                title: string;
                smartForm: string;
                howItWorks: string;
            };
            ia: {
                preferences: string;
                toggle: string;
            };
            legalTitle: string;
            madeWith: string;
            newsletter: {
                title: string;
                description: string;
            };
            newsletterDescription: string;
            newsletterPlaceholder: string;
            newsletterPrivacy: string;
            newsletterSuccess: string;
            newsletterTitle: string;
            partnersDisclaimer: string;
            partnersTitle: string;
            partnerships: {
                title: string;
                gea: string;
                sanjotec: string;
                dg: string;
                turismodeportugal: string;
            };
            paymentMethods: string;
            paymentMethodsData: {
                transfer: string;
            };
            paymentMethodsTitle: string;
            privacy: string;
            product: {
                title: string;
                features: string;
                pricing: string;
                integrations: string;
                api: string;
                mobile: string;
            };
            quickLinksTitle: string;
            rightsReserved: string;
            securePayments: string;
            resources: {
                title: string;
            };
            services: {
                packages: string;
                hotels: string;
                flights: string;
                transfers: string;
                insurance: string;
            };
            servicesTitle: string;
            support: {
                title: string;
                help: string;
                documentation: string;
                status: string;
                community: string;
                technical: string;
                partnerships: string;
                howItWorks: string;
                integrations: string;
                app: string;
            };
            terms: string;
            user: {
                title: string;
                preferences: string;
                accountSettings: string;
                bookingHistory: string;
            };
            verifiedProvider: string;
            blogTitle: string;
        };
        readonly gallery: {
            cta_button: string;
            cta_description: string;
            cta_title: string;
            error_loading: string;
            items_shown: string;
            no_images_found: string;
            subtitle: string;
            title: string;
            viewItemAria: string;
        };
        readonly help: {
            documentation: string;
            actions: {
                helpful: string;
                yes: string;
                no: string;
                feedback: string;
                print: string;
                share: string;
            };
            hero: {
                title: string;
                subtitle: string;
            };
            sections: {
                search: {
                    placeholder: string;
                    button: string;
                    noResults: string;
                    tryDifferent: string;
                };
                categories: {
                    title: string;
                    gettingStarted: {
                        title: string;
                        description: string;
                    };
                    booking: {
                        title: string;
                        description: string;
                    };
                    account: {
                        title: string;
                        description: string;
                    };
                    payments: {
                        title: string;
                        description: string;
                    };
                    technical: {
                        title: string;
                        description: string;
                    };
                    policies: {
                        title: string;
                        description: string;
                    };
                };
                faq: {
                    title: string;
                    viewAll: string;
                    questions: {
                        howToBook: {
                            question: string;
                            answer: string;
                        };
                        cancelBooking: {
                            question: string;
                            answer: string;
                        };
                        paymentMethods: {
                            question: string;
                            answer: string;
                        };
                        refundPolicy: {
                            question: string;
                            answer: string;
                        };
                        changeBooking: {
                            question: string;
                            answer: string;
                        };
                        support: {
                            question: string;
                            answer: string;
                        };
                    };
                };
                contact: {
                    title: string;
                    description: string;
                    liveChat: string;
                    email: string;
                    phone: string;
                    hours: string;
                };
                tutorials: {
                    title: string;
                    description: string;
                    viewAll: string;
                };
            };
        };
        readonly home: {
            aiFeaturesItems: {
                recommendations: {
                    title: string;
                    desc: string;
                };
                planning: {
                    title: string;
                    desc: string;
                };
                personalization: {
                    title: string;
                    desc: string;
                };
            };
            cta: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                button: string;
                title: string;
                desc: string;
                aiBtn: string;
                aiSub: string;
                placeholder: string;
                btn: string;
                privacy: string;
                stats: {
                    subscribers: string;
                    offers: string;
                    countries: string;
                    satisfaction: string;
                };
            };
            destinations: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
            };
            featuredDestinations: {
                title: string;
                subtitle: string;
                viewAllDestinations: string;
                destinations: {
                    santorini: {
                        name: string;
                        description: string;
                        badge: string;
                        price: string;
                    };
                    tokyo: {
                        name: string;
                        description: string;
                        badge: string;
                        price: string;
                    };
                    bali: {
                        name: string;
                        description: string;
                        badge: string;
                        price: string;
                    };
                };
                reviews: string;
            };
            features: {
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                ctaLabel: string;
                guaranteedSecurity: {
                    title: string;
                    description: string;
                };
                specializedGuides: {
                    title: string;
                    description: string;
                };
                support247: {
                    title: string;
                    description: string;
                };
                bestPrices: {
                    title: string;
                    description: string;
                };
                easyBooking: {
                    title: string;
                    description: string;
                };
                curatedExperiences: {
                    title: string;
                    description: string;
                };
                cruises: {
                    title: string;
                    desc: string;
                    badge: string;
                };
                bus: {
                    title: string;
                    desc: string;
                    badge: null;
                };
                beach: {
                    title: string;
                    desc: string;
                    badge: null;
                };
                badge: {
                    popular: string;
                };
            };
            hero: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                ctaMain: string;
                ctaSecondary: string;
                exploreDestinations: string;
                learnMore: string;
            };
            heroAI: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                ctaStart: string;
                ctaDemo: string;
                loading: string;
                preparingDemo: string;
                stats: string[];
            };
            home: string;
            recommendations: {
                title: string;
                subtitle: string;
            };
            stats: {
                satisfiedClients: string;
                exclusiveDestinations: string;
                satisfactionRate: string;
                supportAvailable: string;
                destinations: string;
                partners: string;
                experience: string;
                customers: string;
            };
            statsLabels: {
                destinations: string;
                travelers: string;
                rating: string;
                support: string;
            };
            testimonials: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                ratingLabel: string;
            };
            testimonialsItems: {
                name: string;
                location: string;
                text: string;
            }[];
        };
        readonly hotels: {
            accommodationTypes: {
                title: string;
                description: string;
                learnMore: string;
                types: {
                    hotels: {
                        title: string;
                        description: string;
                        feature1: string;
                        feature2: string;
                    };
                    resorts: {
                        title: string;
                        description: string;
                        feature1: string;
                        feature2: string;
                    };
                    apartments: {
                        title: string;
                        description: string;
                        feature1: string;
                        feature2: string;
                    };
                    boutique: {
                        title: string;
                        description: string;
                        feature1: string;
                        feature2: string;
                    };
                };
            };
            bookingCta: {
                title: string;
                description: string;
                cta: string;
            };
            hero: {
                title: string;
                subtitle: string;
                cta: string;
            };
            destinations: {
                lisbon: string;
                porto: string;
                algarve: string;
                madrid: string;
            };
            popularDestinations: {
                title: string;
                subtitle: string;
                viewHotels: string;
                explore: string;
                error: string;
            };
            ratings: {
                wonderful: string;
                veryGood: string;
                good: string;
                pleasant: string;
                average: string;
            };
            addFavorite: string;
            removeFavorite: string;
            dealOfTheDay: string;
            pricePerNight: string;
            includesTaxes: string;
            details: string;
            bookNow: string;
            listView: string;
            mapView: string;
            showingResults: string;
            mapIntegration: string;
            mapCenter: string;
            noResults: string;
            noResultsDescription: string;
            clearFilters: string;
            filters: {
                title: string;
                freeCancellation: string;
                payAtProperty: string;
                mealPlans: string;
                propertyType: string;
                sortBy: string;
                starRating: string;
                starRatingHint: string;
                wonderful: string;
                veryGood: string;
                good: string;
                pleasant: string;
                clear: string;
                apply: string;
                activeFilters: string;
                noActiveFilters: string;
                activeDescription: string;
                description: string;
                showResults: string;
                clearFilters: string;
                bookingPolicies: string;
                amenities: string;
                guestRating: string;
                priceRange: string;
                minPrice: string;
                maxPrice: string;
            };
            openMaps: {
                title: string;
                description: string;
            };
            search: {
                results: string;
                searching: string;
                hotelsFound: string;
                placeholder: string;
                tryAgain: string;
            };
            seo: {
                title: string;
                titleWithDestination: string;
                siteName: string;
                description: string;
                descriptionWithDestination: string;
            };
        };
        readonly insurance: {
            benefits: {
                badge: string;
                title: string;
                subtitle: string;
                learnMore: string;
                medical: {
                    title: string;
                    description: string;
                };
                cancellation: {
                    title: string;
                    description: string;
                };
                baggage: {
                    title: string;
                    description: string;
                };
            };
            contact: {
                badge: string;
                title: string;
                subtitle: string;
            };
            contactCta: {
                title: string;
                description: string;
                cta: string;
            };
            coverage: {
                badge: string;
                title: string;
                subtitle: string;
                selectPlan: string;
            };
            hero: {
                title: string;
                subtitle: string;
                cta: string;
            };
            whyChooseUs: {
                badge: string;
                title: string;
                subtitle: string;
                feature1_title: string;
                feature1_desc: string;
                feature2_title: string;
                feature2_desc: string;
                feature3_title: string;
                feature3_desc: string;
            };
        };
        readonly language: {
            current: string;
            select: string;
        };
        readonly legal: {
            terms: string;
            privacy: string;
            cancellation: string;
            cancellationPage: {
                hero: {
                    title: string;
                    subtitle: string;
                };
                sectionPolicy: {
                    title: string;
                    intro: string;
                    sections: ({
                        title: string;
                        points: string[];
                        periods?: undefined;
                    } | {
                        title: string;
                        points: string[];
                        periods: {
                            period: string;
                            fee: string;
                        }[];
                    })[];
                    important: {
                        title: string;
                        description: string;
                    };
                };
                sectionHowTo: {
                    title: string;
                    steps: {
                        title: string;
                        description: string;
                        icon: string;
                    }[];
                };
                sectionFaq: {
                    title: string;
                    questions: {
                        q: string;
                        a: string;
                    }[];
                };
                needHelp: {
                    title: string;
                    description: string;
                };
                contactSupport: {
                    title: string;
                    description: string;
                    button: string;
                };
                myBookings: {
                    title: string;
                    description: string;
                    button: string;
                };
                ui: {
                    loading: string;
                    refundTimeline: {
                        title: string;
                        description: string;
                    };
                    howToHint: string;
                };
            };
            cookies: string;
            cookiesPage: {
                title: string;
                ui: {
                    readingProgressAria: string;
                    privacyCenterBadge: string;
                    aboutThisPolicy: string;
                };
                sections: {
                    title: string;
                    content: string[];
                }[];
            };
            gdpr: string;
            gdprPage: {
                hero: {
                    title: string;
                    subtitle: string;
                };
                lastUpdated: string;
                ui: {
                    compliantBadge: string;
                    lastUpdated: string;
                    navigationTitle: string;
                    quickActionsTitle: string;
                    contactDpo: string;
                    exerciseRights: string;
                    nav: {
                        introduction: string;
                        dataCategories: string;
                        dataController: string;
                        dataProcessing: string;
                        dataTypes: string;
                        userRights: string;
                        dataSecurity: string;
                        contact: string;
                    };
                };
                intro: string;
                sections: {
                    dataController: {
                        title: string;
                        content: string;
                        contact: {
                            name: string;
                            email: string;
                            phone: string;
                            address: string;
                        };
                    };
                    dataProcessing: {
                        title: string;
                        purposes: {
                            title: string;
                            description: string;
                            legalBasis: string;
                        }[];
                    };
                    dataTypes: {
                        title: string;
                        categories: {
                            category: string;
                            examples: string[];
                            retention: string;
                        }[];
                    };
                    rights: {
                        title: string;
                        userRights: {
                            right: string;
                            description: string;
                        }[];
                    };
                    dataSecurity: {
                        title: string;
                        measures: string[];
                    };
                    dataTransfers: {
                        title: string;
                        content: string;
                        safeguards: string[];
                    };
                    cookies: {
                        title: string;
                        content: string;
                        linkText: string;
                    };
                    contact: {
                        title: string;
                        content: string;
                        dpoContact: string;
                    };
                };
                effectiveDate: string;
            };
            hero: {
                title: string;
                lastUpdated: string;
                terms: string;
                privacy: string;
                cookies: string;
                cancellation: string;
            };
            privacyPage: {
                title: string;
                ui: {
                    badge: string;
                    updatedLabel: string;
                    applicableLabel: string;
                    printVersion: {
                        title: string;
                        description: string;
                        download: string;
                    };
                    intro: string;
                    contactDpo: string;
                    backToTopAria: string;
                };
                introduction: {
                    title: string;
                    content: string[];
                };
                sections: {
                    title: string;
                    content: string[];
                }[];
            };
            termsPage: {
                title: string;
                introduction: {
                    title: string;
                    content: string[];
                };
                sections: {
                    title: string;
                    content: string[];
                }[];
            };
            title: string;
        };
        readonly loading: {
            loading: {
                admin: string;
                user: string;
                default: string;
                publicPage: string;
                adminDashboard: string;
                userDashboard: string;
                auth: string;
            };
        };
        readonly localGuides: {
            becomeGuide: {
                title: string;
                description: string;
                applyNow: string;
                feature1: {
                    title: string;
                    desc: string;
                };
                feature2: {
                    title: string;
                    desc: string;
                };
                feature3: {
                    title: string;
                    desc: string;
                };
            };
            detailsPanel: {
                about: string;
                tours: string;
                moreInfo: string;
                memberSince: string;
                bookTour: string;
                noTours: string;
                languages: string;
                specialties: string;
                experienceYears: string;
                certifications: string;
                basePrice: string;
                hour: string;
                contactGuideCta: string;
            };
            filters: {
                title: string;
                clear: string;
                searchLabel: string;
                searchPlaceholder: string;
                locationLabel: string;
                allLocations: string;
                specialtyLabel: string;
                allSpecialties: string;
                languageLabel: string;
                allLanguages: string;
            };
            guides: {
                guide_1: {
                    bio: string;
                    tagline: string;
                    tour_title: string;
                    tour_desc: string;
                };
                guide_2: {
                    bio: string;
                    tagline: string;
                    tour_title: string;
                    tour_desc: string;
                };
            };
            guidesList: {
                title: string;
                sortBy: string;
                sortOptions: {
                    rating: string;
                    name: string;
                    experience: string;
                    price: string;
                };
                verified: string;
                reviews_one: string;
                reviews_other: string;
                experience_one: string;
                experience_other: string;
                viewProfile: string;
                noResultsTitle: string;
                noResultsDesc: string;
            };
            hero: {
                badge: string;
                title: string;
                subtitle: string;
            };
            specialties: {
                history: string;
                gastronomy: string;
                nature: string;
                architecture: string;
            };
            page: {
                titlePrefix: string;
                titleHighlight: string;
                loadingExperts: string;
                guidesAvailable: string;
                emptyState: {
                    title: string;
                    description: string;
                    clearAll: string;
                };
                cta: {
                    title: string;
                    subtitle: string;
                    primary: string;
                    secondary: string;
                };
            };
        };
        readonly mobile: {
            app: {
                app: string;
            };
            cta: {
                title: string;
                subtitle: string;
                ios: string;
                android: string;
            };
            features: {
                title: string;
                subtitle: string;
                offlineMaps: {
                    title: string;
                    desc: string;
                };
                pushNotifications: {
                    title: string;
                    desc: string;
                };
                offlineSync: {
                    title: string;
                    desc: string;
                };
                cameraIntegration: {
                    title: string;
                    desc: string;
                };
                gpsNavigation: {
                    title: string;
                    desc: string;
                };
                secureStorage: {
                    title: string;
                    desc: string;
                };
            };
            hero: {
                appLabel: string;
                appStore: string;
                googlePlay: string;
            };
            reviews: {
                title: string;
                subtitle: string;
                maria: {
                    comment: string;
                };
                joao: {
                    comment: string;
                };
                ana: {
                    comment: string;
                };
            };
            screenshots: {
                title: string;
                subtitle: string;
                explore: {
                    title: string;
                    desc: string;
                };
                plan: {
                    title: string;
                    desc: string;
                };
                book: {
                    title: string;
                    desc: string;
                };
            };
            stats: {
                downloads: string;
                rating: string;
                activeUsers: string;
                countries: string;
            };
        };
        readonly nav: {
            about: string;
            activities: string;
            auth: {
                login: string;
                register: string;
            };
            blog: string;
            blogMenu: {
                allPosts: string;
                sustainableTravel: string;
            };
            booking: string;
            community: string;
            contact: string;
            cruzeiros: string;
            cruises: string;
            destinations: string;
            faq: string;
            flights: string;
            gallery: string;
            home: string;
            hotels: string;
            integrations: string;
            language: {
                en: string;
                pt: string;
                es: string;
                fr: string;
                label: string;
            };
            login: string;
            map: string;
            menu: string;
            mobileNavigation: string;
            bottom_nav: string;
            dashboard: string;
            trips: string;
            bookings: string;
            profile: string;
            searchPlaceholder: string;
            quickActions: string;
            newTrip: string;
            newBooking: string;
            support: string;
            notifications: string;
            newBookingConfirmed: string;
            bookingConfirmedForLisbon: string;
            myProfile: string;
            settings: string;
            billing: string;
            help: string;
            search: string;
            account: string;
            openMenu: string;
            packages: string;
            planYourTrip: string;
            poweredByAI: string;
            preferences: string;
            register: string;
            rent_a_car: string;
            services: string;
            servicesList: {
                packages: string;
                hotels: string;
                flights: string;
                transfers: string;
                cruises: string;
                localGuides: string;
                insurance: string;
                all: string;
                ferries: string;
                trains: string;
                rent_a_car: string;
                buses: string;
                activities: string;
            };
            smartForm: string;
            sustainable: string;
            userMenu: {
                profile: string;
                settings: string;
                dashboard: string;
                logout: string;
                billing: string;
                help: string;
            };
            userNavigation: {
                dashboard: string;
                trips: string;
                bookings: string;
                profile: string;
                payments: string;
                settings: string;
            };
        };
        readonly newsletter: {
            newsletter: {
                description: string;
                emailLabel: string;
                emailPlaceholder: string;
                subscribeButton: string;
                title: string;
            };
            title: string;
            description: string;
            emailPlaceholder: string;
            subscribeButton: string;
        };
        readonly notifications: {
            empty: string;
            error: string;
            info: string;
            markAll: string;
            success: string;
            title: string;
            toggle: string;
            unread: string;
            urgent: string;
            viewAll: string;
            warning: string;
        };
        readonly packages: {
            customCta: {
                title: string;
                description: string;
                cta: string;
            };
            hero: {
                title: string;
                subtitle: string;
                cta: string;
                viewDeals: string;
            };
            packageTypes: {
                title: string;
                description: string;
                explore: string;
                romantic: {
                    title: string;
                    description: string;
                    feature1: string;
                    feature2: string;
                };
                family: {
                    title: string;
                    description: string;
                    feature1: string;
                    feature2: string;
                };
                adventure: {
                    title: string;
                    description: string;
                    feature1: string;
                    feature2: string;
                };
                gastronomic: {
                    title: string;
                    description: string;
                    feature1: string;
                    feature2: string;
                };
                luxury: {
                    title: string;
                    description: string;
                };
                wellness: {
                    title: string;
                    description: string;
                };
                "group-travel": {
                    title: string;
                    description: string;
                };
                "cultural-exchange": {
                    title: string;
                    description: string;
                };
                "photography-tourism": {
                    title: string;
                    description: string;
                };
                "snow-sports": {
                    title: string;
                    description: string;
                };
                "corporate-travel": {
                    title: string;
                    description: string;
                };
                "coastal-tourism": {
                    title: string;
                    description: string;
                };
            };
            personalized: {
                title: string;
                description: string;
                learnMore: string;
            };
            featuredPackages: {
                title: string;
            };
            page: {
                hero: {
                    title: string;
                    subtitle: string;
                };
                error: {
                    title: string;
                    message: string;
                    retry: string;
                };
                empty: {
                    title: string;
                    message: string;
                };
                unknown: string;
                onRequest: string;
                brand: string;
                featured: string;
                categoryBanner: {
                    title: string;
                    subtitle: string;
                    cta: string;
                };
                stats: {
                    packages: string;
                    destinations: string;
                    categories: string;
                    averageRating: string;
                    na: string;
                };
                schema: {
                    collectionName: string;
                    collectionDescription: string;
                    breadcrumbHome: string;
                    breadcrumbPackages: string;
                    organizationName: string;
                    organizationDescription: string;
                };
            };
        };
        readonly payments: {
            actions: {
                menu: string;
                options: string;
                configure: string;
                viewProvider: string;
                activate: string;
                deactivate: string;
                delete: string;
                clickToActivate: string;
                clickToDeactivate: string;
            };
            addMethod: string;
            currency: {
                free: string;
            };
            description: string;
            dialog: {
                addTitle: string;
                editTitle: string;
                addDescription: string;
                editDescription: string;
                fields: {
                    methodName: string;
                    methodNamePlaceholder: string;
                    provider: string;
                    providerPlaceholder: string;
                    feesDescription: string;
                    feesPlaceholder: string;
                    activeMethod: string;
                };
                buttons: {
                    cancel: string;
                    saving: string;
                    saveChanges: string;
                    addMethod: string;
                };
            };
            messages: {
                methodsLoaded: string;
                loadError: string;
                loadErrorDescription: string;
                validationError: string;
                nameRequired: string;
                updateSuccess: string;
                methodUpdated: string;
                methodAdded: string;
                saveError: string;
                saveErrorDescription: string;
                statusUpdated: string;
                statusUpdateError: string;
                deleteConfirm: string;
                methodDeleted: string;
                deleteError: string;
            };
            stats: {
                activeMethods: string;
                activeMethodsDescription: string;
                averageFee: string;
                averageFeeDescription: string;
                mostPopular: string;
                mostPopularValue: string;
                mostPopularDescription: string;
                nextReview: string;
                nextReviewValue: string;
                nextReviewDescription: string;
            };
            status: {
                ativo: string;
                inativo: string;
                em_configuracao: string;
            };
            table: {
                title: string;
                description: string;
                searchPlaceholder: string;
                tabs: {
                    all: string;
                    active: string;
                    inactive: string;
                };
                headers: {
                    name: string;
                    provider: string;
                    status: string;
                    fees: string;
                    availableIn: string;
                    lastUpdated: string;
                    actions: string;
                };
                noMethods: string;
                global: string;
            };
            title: string;
        };
        readonly preferences: {
            loading: {
                initializing: string;
            };
            header: {
                title: string;
                description: string;
            };
            tabs: {
                travelProfile: string;
                aiBehavior: string;
                aiEngine: string;
                privacy: string;
                analytics: string;
            };
            activities: {
                beaches: string;
                adventure: string;
                culture: string;
                gastronomy: string;
                nightlife: string;
                nature: string;
                photography: string;
                shopping: string;
                wellness: string;
            };
            budget: string;
            budgetOptions: {
                select: string;
                "500-1000": string;
                "1000-3000": string;
                "3000-5000": string;
                "5000+": string;
            };
            comments: string;
            departureDate: string;
            destination: string;
            destinations: {
                europe: string;
                asia: string;
                northAmerica: string;
                southAmerica: string;
                africa: string;
                oceania: string;
                caribbean: string;
                middleEast: string;
            };
            duration: string;
            durationOptions: {
                select: string;
                weekend: string;
                week: string;
                "2weeks": string;
                month: string;
            };
            email: string;
            errorGeneratingTrip: string;
            errorSavingFeedback: string;
            feedbackSaved: string;
            generateTrip: string;
            generating: string;
            interests: string;
            interestsEnum: {
                ADVENTURE: string;
                CULTURE: string;
                RELAXATION: string;
                NATURE: string;
                GASTRONOMY: string;
            };
            itinerary: string;
            name: string;
            nextMonth: string;
            nextQuarter: string;
            nextWeek: string;
            placeholders: {
                groupSize: string;
                dietary: string;
                specialRequests: string;
            };
            planningSection: string;
            provideFeedback: string;
            quickSelection: string;
            rating: string;
            returnDate: string;
            selectDepartureDate: string;
            selectInterest: string;
            selectReturnDate: string;
            selectSustainability: string;
            submit: string;
            submitFeedback: string;
            submitting: string;
            subtitle: string;
            success: string;
            successDescription: string;
            sustainability: string;
            sustainabilityEnum: {
                LOW: string;
                MEDIUM: string;
                HIGH: string;
            };
            title: string;
            travelDates: string;
            travelStyles: {
                luxury: string;
                adventure: string;
                budget: string;
            };
            travelers: string;
            tripGenerated: string;
            validation: {
                nameRequired: string;
                emailInvalid: string;
                budgetPositive: string;
                durationPositive: string;
                travelersMin: string;
            };
            yourTripProposal: string;
        };
        readonly press: {
            hero: {
                title: string;
                subtitle: string;
                contactPress: string;
                pressKit: string;
            };
            releases: {
                title: string;
                subtitle: string;
                filterLabel: string;
                featured: string;
                readMore: string;
                noResults: string;
            };
            mediaKit: {
                title: string;
                subtitle: string;
                download: string;
            };
            contact: {
                title: string;
                subtitle: string;
            };
        };
        readonly pricing: {
            billing: {
                monthly: string;
                annually: string;
                toggleAriaLabel: string;
                defaultSave: string;
                perYearShort: string;
                perMonthShort: string;
            };
            choosePlan: {
                title: string;
                description: string;
            };
            faq: {
                title: string;
                description: string;
                q1: {
                    title: string;
                    description: string;
                };
                q2: {
                    title: string;
                    description: string;
                };
                q3: {
                    title: string;
                    description: string;
                };
                q4: {
                    title: string;
                    description: string;
                };
                q5: {
                    title: string;
                    description: string;
                    linkText: string;
                };
            };
            free: string;
            hero: {
                title: string;
                subtitle: string;
            };
            plans: {
                mostPopular: string;
                popularBadge: string;
                bonusFeature: string;
                basic: {
                    name: string;
                    description: string;
                    cta: string;
                    feature1: string;
                    feature2: string;
                    feature3: string;
                    feature4: string;
                    feature4Tooltip: string;
                };
                premium: {
                    name: string;
                    description: string;
                    cta: string;
                    annualSave: string;
                    feature1: string;
                    feature2: string;
                    feature3: string;
                    feature3Tooltip: string;
                    feature4: string;
                    feature5: string;
                    feature6: string;
                };
                business: {
                    name: string;
                    description: string;
                    cta: string;
                    priceSuffix: string;
                    annualSave: string;
                    feature1: string;
                    feature2: string;
                    feature3: string;
                    feature4: string;
                    feature5: string;
                    feature5Tooltip: string;
                    feature6: string;
                    feature7: string;
                };
            };
        };
        readonly profile: {
            account: {
                title: string;
                delete_account: string;
                delete_confirm: string;
                account_deleted: string;
            };
            address: {
                title: string;
                description: string;
                street: string;
                number: string;
                complement: string;
                neighborhood: string;
                city: string;
                state: string;
                postal_code: string;
                country: string;
            };
            admin: {
                dashboard: string;
                users: string;
                settings: {
                    title: string;
                };
                blog: string;
                sustainable_travel: string;
            };
            complete: string;
            completeness: string;
            contact: string;
            currency_options: {
                eur: string;
                usd: string;
                gbp: string;
                brl: string;
            };
            data_sharing: {
                title: string;
                share_with_partners: string;
                share_with_partners_description: string;
            };
            description: string;
            edit: string;
            gender_options: {
                male: string;
                female: string;
                other: string;
                prefer_not_to_say: string;
            };
            info_updated: string;
            language_options: {
                pt: string;
                en: string;
                es: string;
                fr: string;
            };
            logout: string;
            marital_status_options: {
                single: string;
                married: string;
                divorced: string;
                widowed: string;
            };
            notifications: {
                title: string;
                marketing_emails: string;
                marketing_emails_description: string;
                sms_notifications: string;
                sms_notifications_description: string;
                push_notifications: string;
                push_notifications_description: string;
            };
            payment: string;
            payment_methods: {
                title: string;
                description: string;
                no_methods: string;
                add_method: string;
                add_new_button: string;
            };
            personal: string;
            personal_data: {
                title: string;
                description: string;
                first_name: string;
                last_name: string;
                email: string;
                phone: string;
                date_of_birth: string;
                nationality: string;
                tax_id: string;
                gender: string;
                marital_status: string;
            };
            preferences: string;
            privacy: string;
            privacy_settings: {
                title: string;
                description: string;
                profile_visibility: string;
                show_email: string;
                show_email_description: string;
                show_phone: string;
                show_phone_description: string;
                show_address: string;
                show_address_description: string;
            };
            profile: {
                email_verified: string;
                phone_not_verified: string;
                personal_data_description: string;
                first_name: string;
                last_name: string;
                email: string;
                phone: string;
                date_of_birth: string;
                nationality: string;
                tax_id: string;
                gender: string;
                male: string;
                female: string;
                other: string;
                prefer_not_to_say: string;
                marital_status: string;
                single: string;
                married: string;
                divorced: string;
                widowed: string;
                address: string;
                address_description: string;
                street: string;
                number: string;
                complement: string;
                neighborhood: string;
                city: string;
                state: string;
                postal_code: string;
                country: string;
                travel_preferences_description: string;
                preferred_currency: string;
                euro: string;
                us_dollar: string;
                british_pound: string;
                brazilian_real: string;
                preferred_language: string;
                portuguese: string;
                english: string;
                spanish: string;
                french: string;
                payment_methods: string;
                payment_methods_description: string;
                no_payment_methods: string;
                add_payment_method: string;
                add_payment_method_button: string;
                privacy_settings_description: string;
                profile_visibility: string;
                show_email: string;
                show_email_description: string;
                show_phone: string;
                show_phone_description: string;
                show_address: string;
                show_address_description: string;
                marketing_emails: string;
                marketing_emails_description: string;
                sms_notifications: string;
                sms_notifications_description: string;
                push_notifications: string;
                push_notifications_description: string;
                share_data_with_partners: string;
                share_data_with_partners_description: string;
            };
            save_changes: string;
            security: {
                title: string;
                current_password: string;
                new_password: string;
                confirm_new_password: string;
                change_password: string;
                passwords_dont_match: string;
                password_updated: string;
                invalid_password: string;
            };
            title: string;
            travel_preferences: {
                title: string;
                description: string;
                preferred_currency: string;
                preferred_language: string;
            };
            unexpected_error: string;
            verification: {
                email_verified: string;
                phone_not_verified: string;
            };
        };
        readonly profilepreferences: {
            budget: string;
            duration: string;
            group_size: string;
            payment_methods: string;
            preferred_currency: string;
            preferred_language: string;
            select_budget: string;
            select_duration: string;
            select_payment_method: string;
            title: string;
            travel_preferences: string;
        };
        readonly register: {
            account_created_success: string;
            already_have_account: string;
            confirm_password: string;
            confirm_your_password: string;
            continue_with_facebook: string;
            continue_with_google: string;
            create_account: string;
            create_account_button: string;
            create_password: string;
            creating_account: string;
            email: string;
            error_creating_account: string;
            fill_required_fields: string;
            first_name: string;
            form: {
                accept_terms: string;
                accept_privacy: string;
                accept_cookies: string;
                newsletter: string;
                terms_of_service: string;
                privacy_policy: string;
                cookie_policy: string;
            };
            last_name: string;
            login_link: string;
            medium: string;
            or: string;
            password: string;
            password_strength: string;
            passwords_dont_match: string;
            phone: string;
            required_field: string;
            strong: string;
            subtitle: string;
            title: string;
            unexpected_error: string;
            weak: string;
        };
        readonly rentacar: {
            action: string;
            any: string;
            availableCars: string;
            availableNow: string;
            bookNow: string;
            carType: string;
            carsFound: string;
            contactInfo: string;
            contactSupport: string;
            endDate: string;
            feature1: string;
            feature2: string;
            feature3: string;
            image: string;
            location: string;
            locations: string;
            maxPrice: string;
            model: string;
            needHelp: string;
            price: string;
            pricePerDay: string;
            quickStats: string;
            search: string;
            searchAndBook: string;
            searchModel: string;
            searchPlaceholder: string;
            startDate: string;
            subtitle: string;
            titlePart1: string;
            titlePart2: string;
            totalCars: string;
            totalPrice: string;
            whyChooseUs: string;
        };
        readonly search: {
            errors: {
                searchTitle: string;
                searchDescription: string;
            };
            filters: {
                title: string;
                clear: string;
                clearedTitle: string;
                clearedDescription: string;
                type: {
                    title: string;
                    destinations: string;
                    hotels: string;
                    packages: string;
                    attractions: string;
                    restaurants: string;
                };
                price: {
                    title: string;
                };
                rating: {
                    title: string;
                    any: string;
                };
            };
            header: {
                exploreOffers: string;
                resultsFor: string;
            };
            results: {
                count: string;
                featured: string;
                forQuery: string;
                types: {
                    destination: string;
                    transfer: string;
                    restaurant: string;
                    cruise: string;
                    attraction: string;
                    package: string;
                    hotel: string;
                    flight: string;
                };
                reviews: string;
                noReviews: string;
                perWhat: {
                    vehicle: string;
                    experience: string;
                    guest: string;
                    person: string;
                    night: string;
                };
                viewDetails: string;
            };
            sort: {
                placeholder: string;
                relevance: string;
                priceLow: string;
                priceHigh: string;
                ratingHigh: string;
                nameAZ: string;
            };
            view: {
                list: string;
                map: string;
            };
        };
        readonly services: {
            benefits: {
                title: string;
                subtitle: string;
                items: string[];
            };
            cta: {
                title: string;
                subtitle: string;
                buttons: {
                    quote: string;
                    destinations: string;
                };
            };
            hero: {
                badge: string;
                title: string;
                subtitle: string;
            };
            mainServices: {
                title: string;
                subtitle: string;
                popularBadge: string;
                ctaButton: string;
                items: {
                    packages: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    flights: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    hotels: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    transfers: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    cruises: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    localGuides: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    insurance: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                };
            };
            process: {
                title: string;
                subtitle: string;
                items: {
                    step1: {
                        title: string;
                        description: string;
                    };
                    step2: {
                        title: string;
                        description: string;
                    };
                    step3: {
                        title: string;
                        description: string;
                    };
                    step4: {
                        title: string;
                        description: string;
                    };
                };
            };
            specializedServices: {
                title: string;
                subtitle: string;
                ctaButton: string;
                items: {
                    honeymoon: {
                        title: string;
                        description: string;
                    };
                    groupTravel: {
                        title: string;
                        description: string;
                    };
                    culturalExchange: {
                        title: string;
                        description: string;
                    };
                    photoTourism: {
                        title: string;
                        description: string;
                    };
                };
            };
        };
        readonly settings: {
            settings: {
                title: string;
                subtitle: string;
                notifications: string;
                notificationsDescription: string;
                disable: string;
                enable: string;
                language: string;
                languageDescription: string;
                dangerZone: string;
                dangerZoneDescription: string;
                deleteAccount: string;
                notificationTypes: {
                    email: string;
                    push: string;
                    sms: string;
                };
                notificationDescriptions: {
                    email: string;
                    push: string;
                    sms: string;
                };
            };
        };
        readonly 'smart-form': {
            basics: {
                header: {
                    title: string;
                    subtitle: string;
                };
                completion: {
                    allDone: string;
                    progress: string;
                };
                aria: {
                    progressBar: string;
                    done: string;
                    pending: string;
                    stepStatus: string;
                };
                groups: {
                    whereWhen: {
                        label: string;
                        description: string;
                    };
                    whoHow: {
                        label: string;
                        description: string;
                    };
                    travelType: {
                        label: string;
                        description: string;
                    };
                };
                sections: {
                    destination: {
                        title: string;
                        subtitle: string;
                    };
                    dates: {
                        title: string;
                        subtitle: string;
                    };
                    travelers: {
                        title: string;
                        subtitle: string;
                    };
                    language: {
                        title: string;
                        subtitle: string;
                    };
                };
            };
            budget: {
                header: {
                    title: string;
                    subtitle: string;
                };
                categories: {
                    accommodation: string;
                    food: string;
                    activities: string;
                    transport: string;
                    shopping: string;
                    emergency: string;
                    travelInsurance: string;
                };
                settings: {
                    title: string;
                    subtitle: string;
                    currency: string;
                    durationDays: string;
                };
                savings: {
                    title: string;
                    subtitle: string;
                    amount: string;
                    progress: string;
                    savedOf: string;
                    total: string;
                };
                tips: {
                    title: string;
                    subtitle: string;
                    emergencyBuffer: {
                        title: string;
                        body: string;
                    };
                    dailySpending: {
                        title: string;
                        body: string;
                        bodyWithSuggestion: string;
                    };
                    savingsStrategy: {
                        title: string;
                        good: string;
                        improve: string;
                    };
                };
                overview: {
                    totalBudget: {
                        label: string;
                        perDay: string;
                    };
                    savingsGoal: {
                        label: string;
                        percentOfTotal: string;
                    };
                    tripDuration: {
                        label: string;
                        value: string;
                        extended: string;
                        short: string;
                    };
                };
                aria: {
                    sidebar: string;
                };
            };
            personalization: {
                title: string;
                description: string;
                banner: {
                    noPreferences: string;
                    noActivities: string;
                    ready: string;
                    count: string;
                };
                sections: {
                    travelPreferences: {
                        title: string;
                        subtitle: string;
                    };
                    activities: {
                        title: string;
                        subtitle: string;
                    };
                };
            };
        };
        readonly support: {
            agents: {
                title: string;
                subtitle: string;
                rating: string;
                responseTime: string;
                specialties: string;
                languages: string;
                startChat: string;
                offline: string;
                online: string;
            };
            articles: {
                title: string;
                subtitle: string;
                readTime: string;
                views: string;
                updated: string;
                readArticle: string;
                difficulty: {
                    beginner: string;
                    intermediate: string;
                    advanced: string;
                };
            };
            channels: {
                title: string;
                subtitle: string;
                liveChat: string;
                email: string;
                phone: string;
                videoCall: string;
                contact: string;
                unavailable: string;
                availability: string;
                responseTime: string;
                languages: string;
            };
            common: {
                loading: string;
                error: string;
                success: string;
                cancel: string;
                save: string;
                close: string;
                back: string;
                next: string;
                previous: string;
            };
            emergency: {
                title: string;
                subtitle: string;
                phone: string;
                emergencyChat: string;
            };
            faq: {
                title: string;
                subtitle: string;
                results: string;
                helpful: string;
                views: string;
                viewMore: string;
                helpfulButton: string;
                noResults: string;
                showAll: string;
                categories: {
                    all: string;
                    bookings: string;
                    api: string;
                    payments: string;
                    account: string;
                    mobile: string;
                    security: string;
                };
            };
            hero: {
                title: string;
                subtitle: string;
                searchPlaceholder: string;
                searchButton: string;
                supportHours: string;
                responseTime: string;
            };
            search: {
                placeholder: string;
                noResults: string;
                resultsFound: string;
            };
            stats: {
                avgResponseTime: string;
                satisfactionRate: string;
                articlesAvailable: string;
                supportAgents: string;
            };
            tabs: {
                faq: string;
                articles: string;
                ticket: string;
                agents: string;
            };
            ticket: {
                title: string;
                subtitle: string;
                form: {
                    name: string;
                    email: string;
                    subject: string;
                    category: string;
                    priority: string;
                    description: string;
                    attachments: string;
                    submit: string;
                    submitting: string;
                    selectCategory: string;
                    selectPriority: string;
                    dragFiles: string;
                    maxFiles: string;
                };
                categories: {
                    technical: string;
                    billing: string;
                    account: string;
                    feature: string;
                    other: string;
                };
                priorities: {
                    low: string;
                    medium: string;
                    high: string;
                    urgent: string;
                };
            };
        };
        readonly sustainable: {
            articles: {
                readMore: string;
            };
            page: {
                hero: {
                    title: string;
                    subtitle: string;
                };
                commitment: {
                    title: string;
                    subtitle: string;
                    pillars: {
                        icon: string;
                        title: string;
                        description: string;
                        colorClass: string;
                    }[];
                };
                practices: {
                    title: string;
                    subtitle: string;
                    items: {
                        id: string;
                        icon: string;
                        title: string;
                        description: string;
                        points: string[];
                    }[];
                };
                articles: {
                    title: string;
                    subtitle: string;
                    items: {
                        title: string;
                        excerpt: string;
                        image: string;
                        category: string;
                        date: string;
                        slug: string;
                    }[];
                    readMore: string;
                    cta: string;
                };
                joinMovement: {
                    title: string;
                    description: string;
                    mainCta: string;
                    secondaryCta: string;
                };
                callToAction: string;
            };
        };
        readonly terms: {
            responsibility: {
                title: string;
                subtitle: string;
                lastUpdated: string;
                effectiveDate: string;
                introduction: string;
                sections: {
                    liability: {
                        title: string;
                        intro: string;
                        scope: string;
                        exclusions: string[];
                    };
                    client: {
                        title: string;
                        intro: string;
                        items: string[];
                    };
                    company: {
                        title: string;
                        intro: string;
                        items: string[];
                    };
                    insurance: {
                        title: string;
                        intro: string;
                        coverage: string[];
                        company: string;
                    };
                    disputes: {
                        title: string;
                        intro: string;
                        procedure: string[];
                        jurisdiction: string;
                    };
                };
            };
            error: {
                title: string;
                message: string;
                retry: string;
            };
            terms: {
                lastUpdated: string;
                effective: string;
                version: string;
                download: string;
                print: string;
            };
            footer: {
                newsletter: {
                    title: string;
                    description: string;
                    placeholder: string;
                    success: string;
                    error: string;
                };
                contact: {
                    title: string;
                };
                legal: {
                    title: string;
                };
                compliance: {
                    title: string;
                };
                governed: string;
                questions: string;
                rights: string;
                secure: string;
                verified: string;
                transparent: string;
            };
        };
        readonly testimonials: {
            listTitle: string;
            quotePrefix: string;
            quoteSuffix: string;
            rating: string;
            subtitle: string;
            title: string;
            feedbackLabel: string;
            noReviews: string;
            totalReviews: string;
            averageRating: string;
            verified: string;
            featured: string;
            fallback: {
                comments: string[];
                trips: string[];
            };
        };
        readonly theme: {
            accessibility: {
                themeToggle: string;
                currentTheme: string;
                themeMenu: string;
                closeMenu: string;
            };
            adminDark: string;
            adminLight: string;
            auto: string;
            autoActive: string;
            current: string;
            dark: string;
            interfaceTitle: string;
            light: string;
            moreOptions: string;
            nightSchedule: string;
            settings: {
                title: string;
                description: string;
                autoMode: string;
                autoModeDescription: string;
                manualMode: string;
                manualModeDescription: string;
            };
            simpleMode: string;
            toggleAria: string;
            toggleTitle: string;
            userDark: string;
            userLight: string;
        };
        readonly transfer: {
            bookingForm: {
                title: string;
                description: string;
                from: string;
                from_placeholder: string;
                to: string;
                to_placeholder: string;
                button: string;
            };
            cta: {
                title: string;
                description: string;
                button: string;
            };
            fleet: {
                title: string;
                subtitle: string;
                vehicle: {
                    sedan: string;
                    sedan_desc: string;
                    executive: string;
                    executive_desc: string;
                    van: string;
                    van_desc: string;
                };
            };
            hero: {
                title: string;
                subtitle: string;
            };
            howItWorks: {
                title: string;
                subtitle: string;
                step1_title: string;
                step1_desc: string;
                step2_title: string;
                step2_desc: string;
                step3_title: string;
                step3_desc: string;
            };
        };
        readonly transfers: {
            bookingForm: {
                title: string;
                description: string;
                from: string;
                from_placeholder: string;
                to: string;
                to_placeholder: string;
                button: string;
            };
            cta: {
                title: string;
                description: string;
                button: string;
            };
            fleet: {
                title: string;
                subtitle: string;
                vehicle: {
                    sedan: string;
                    sedan_desc: string;
                    executive: string;
                    executive_desc: string;
                    van: string;
                    van_desc: string;
                };
            };
            hero: {
                title: string;
                subtitle: string;
            };
            howItWorks: {
                title: string;
                subtitle: string;
                step1: {
                    title: string;
                    description: string;
                };
                step2: {
                    title: string;
                    description: string;
                };
                step3: {
                    title: string;
                    description: string;
                };
            };
            toast: {
                noResultsTitle: string;
                noResultsDescription: string;
            };
        };
        readonly 'traveler-profile': {
            profile: {
                title: string;
                completeness: {
                    title: string;
                    complete: string;
                    incomplete: string;
                    progress: string;
                    completeItem: string;
                    items: {
                        profile_photo: string;
                        phone: string;
                        documents: string;
                        emergency_contact: string;
                        ai_preferences: string;
                        travel_preferences: string;
                        payment_methods: string;
                        address: string;
                    };
                };
            };
            documents: {
                title: string;
                subtitle: string;
                add: string;
                addTitle: string;
                addDescription: string;
                noDocuments: string;
                fields: {
                    type: string;
                    number: string;
                    issueDate: string;
                    expiryDate: string;
                    issuer: string;
                };
                types: {
                    passport: string;
                    national_id: string;
                    visa: string;
                    drivers_license: string;
                    travel_pass: string;
                };
                status: {
                    valid: string;
                    expiring_soon: string;
                    expired: string;
                    needs_verification: string;
                };
                verified: string;
                issued: string;
                expires: string;
                expiresIn: string;
                upload: string;
                delete: string;
            };
            emergencyContact: {
                title: string;
                subtitle: string;
                add: string;
                addTitle: string;
                addDescription: string;
                noContacts: string;
                fields: {
                    name: string;
                    relationship: string;
                    phone: string;
                    email: string;
                };
                relationships: {
                    spouse: string;
                    parent: string;
                    sibling: string;
                    child: string;
                    friend: string;
                    other: string;
                };
                primary: string;
                delete: string;
            };
            stats: {
                title: string;
                subtitle: string;
                totalTrips: string;
                countries: string;
                cities: string;
                daysTraveled: string;
                milesTraveled: string;
                reviews: string;
                averageRating: string;
                upcomingTrips_one: string;
                upcomingTrips_other: string;
                favoriteDestination: string;
            };
            badges: {
                title: string;
                earned: string;
                nextBadges: string;
                types: {
                    first_trip: {
                        name: string;
                        description: string;
                    };
                    explorer: {
                        name: string;
                        description: string;
                    };
                    world_traveler: {
                        name: string;
                        description: string;
                    };
                    early_booker: {
                        name: string;
                        description: string;
                    };
                    sustainable_traveler: {
                        name: string;
                        description: string;
                    };
                    reviewer: {
                        name: string;
                        description: string;
                    };
                    loyal_customer: {
                        name: string;
                        description: string;
                    };
                    adventure_seeker: {
                        name: string;
                        description: string;
                    };
                    culture_enthusiast: {
                        name: string;
                        description: string;
                    };
                    beach_lover: {
                        name: string;
                        description: string;
                    };
                    mountain_explorer: {
                        name: string;
                        description: string;
                    };
                    city_hopper: {
                        name: string;
                        description: string;
                    };
                    foodie_traveler: {
                        name: string;
                        description: string;
                    };
                    budget_savvy: {
                        name: string;
                        description: string;
                    };
                    luxury_traveler: {
                        name: string;
                        description: string;
                    };
                };
            };
            tabs: {
                personal: string;
                travel: string;
                preferences: string;
            };
            actions: {
                save: string;
                cancel: string;
                edit: string;
                delete: string;
                add: string;
            };
        };
    };
    readonly es: {
        readonly about: {
            certifications: {
                title: string;
                subtitle: string;
                verified: string;
                items: {
                    turismoPortugal: {
                        name: string;
                        description: string;
                        type: string;
                    };
                    iata: {
                        name: string;
                        description: string;
                        type: string;
                    };
                    lre: {
                        name: string;
                        description: string;
                        type: string;
                    };
                };
            };
            company: {
                name: string;
                slogan: string;
            };
            coreValues: {
                mainTitle1: string;
                mainTitle2: string;
                mainSubtitle: string;
                personalization: {
                    title: string;
                    desc: string;
                };
                sustainability: {
                    title: string;
                    desc: string;
                };
                ethicsIntegrity: {
                    title: string;
                    desc: string;
                };
                innovation: {
                    title: string;
                    desc: string;
                };
                clientFocus: {
                    title: string;
                    desc: string;
                };
                community: {
                    title: string;
                    desc: string;
                };
            };
            footer: {
                callNow: string;
                backToTop: string;
                cta: {
                    title: string;
                    subtitle: string;
                    contact: string;
                    explore: string;
                };
            };
            founder: {
                bio1: string;
                quote: string;
                badge1: string;
                badge2: string;
                badge3: string;
                title1: string;
                title2: string;
            };
            hero: {
                title1: string;
                title2: string;
                subtitle: string;
                cta: string;
            };
            mapContact: {
                title: string;
                address: string;
                phone: string;
                email: string;
            };
            partnerships: {
                title1: string;
                title2: string;
                subtitle: string;
                gea: {
                    desc: string;
                };
                sanjotec: {
                    desc: string;
                };
                dgconsulting: {
                    desc: string;
                };
                turismodeportugal: {
                    desc: string;
                };
                officialPartner: string;
            };
            stats: {
                satisfiedClients: string;
                exclusiveDestinations: string;
                satisfactionRate: string;
                supportAvailable: string;
            };
            story: {
                title1: string;
                title2: string;
                subtitle: string;
                visionTitle: string;
                paragraph1: string;
                paragraph2: string;
                ourMission: string;
                missionStatement: string;
                imageAlt: string;
                location: string;
            };
            team: {
                title: string;
                subtitle: string;
                luis: {
                    name: string;
                    status: string;
                    bioTitle: string;
                    role: string;
                    bio: string;
                    fullBio: string;
                    curriculum: string[];
                    contact: string;
                    knowMore: string;
                    experience: string;
                    contactMe: string;
                };
            };
            trust: {
                title1: string;
                title2: string;
                subtitle: string;
            };
            newsletter: {
                title: string;
            };
            mobile: {
                app: {
                    app: string;
                };
            };
            help: {
                documentation: string;
            };
            legal: {
                terms: string;
                privacy: string;
                cookies: string;
                gdpr: string;
                cancellation: string;
            };
        };
        readonly activities: {
            activities: {
                title: string;
                subtitle: string;
                searchPlaceholder: string;
                searchButton: string;
                noActivitiesFound: string;
                errorFetching: string;
                viewOnTripAdvisor: string;
            };
        };
        readonly activity: {
            empty: string;
            title: string;
        };
        readonly admin: {
            accessDenied: string;
            actions: string;
            adminRequired: string;
            ai: {
                serviceStatus: {
                    title: string;
                    description: string;
                };
                results: {
                    chatTitle: string;
                    sentTitle: string;
                    priceTitle: string;
                    anomTitle: string;
                    itinTitle: string;
                };
                resultDisplay: {
                    processingTitle: string;
                    processingDesc: string;
                    successTitle: string;
                    errorTitle: string;
                    completionTimeLabel: string;
                    unknownError: string;
                    testingLabel: string;
                };
                history: {
                    title: string;
                    description: string;
                    noItems: string;
                    clearButton: string;
                    item: {
                        service: string;
                        title: string;
                        time: string;
                        duration: string;
                    };
                };
            };
            all: string;
            analytics: {
                title: string;
                subtitle: string;
                noData: string;
                noDataAvailable: string;
                loadingError: string;
                exporting: string;
                format: string;
                exportCSV: string;
                exportPDF: string;
                tabs: {
                    overview: string;
                    traffic: string;
                    conversion: string;
                    destinations: string;
                };
                kpi: {
                    bookings: string;
                    revenue: string;
                    users: string;
                    conversion: string;
                    avgOrder: string;
                    bounceRate: string;
                    perBooking: string;
                };
            };
            app: {
                name: string;
                version: string;
                "Toggle theme": string;
                "More options": string;
            };
            applyFilters: string;
            auth: string;
            backToLogs: string;
            booking: string;
            breadcrumb: {
                home: string;
                admin: string;
            };
            cancel: string;
            category: string;
            breadcrumbs: {
                admin: string;
                users: string;
                analytics: string;
                dashboard: string;
                bookings: string;
                content: string;
                settings: string;
                reports: string;
                system: string;
            };
            clear: string;
            clearFilters: string;
            close: string;
            collapse: string;
            confirmDeleteLog: string;
            confirmDeleteSelected: string;
            copied: string;
            copyToClipboard: string;
            critical: string;
            dashboard: {
                title: string;
                description: string;
                welcome: string;
                crm: string;
                crm_description: string;
                bookings: string;
                bookings_description: string;
                finances: string;
                finances_description: string;
                account: string;
                account_description: string;
                newsletter: string;
                newsletter_description: string;
                destinations: string;
                destinations_description: string;
                blog: string;
                blog_description: string;
                sustainable_travel: string;
                sustainable_travel_description: string;
                settings: string;
                settings_description: string;
                more: string;
                total_clients: string;
                active_bookings: string;
                monthly_revenue: string;
                conversion_rate: string;
                previous_month: string;
                recent_bookings: string;
                bookings_management: string;
                clients_management: string;
                general_settings: string;
                manage_admin_users: string;
                configure_email_templates: string;
                content_management: string;
                system_settings: string;
                data_backup: string;
                system_logs: string;
                export_data: string;
                activities: string;
                activities_description: string;
                content_hub: string;
                content_hub_description: string;
                financial_dashboard: string;
                financial_dashboard_description: string;
                financialDashboard: string;
                dashboardOverview: string;
                revenueVsExpenses: string;
                profitTrend: string;
                expenseCategories: string;
                totalRevenue: string;
                totalExpenses: string;
                totalProfit: string;
                avgMonthlyProfit: string;
                revenue: string;
                expenses: string;
                profit: string;
                refresh: string;
                export: string;
                account_overview: string;
                account_overview_description: string;
            };
            dateRange: string;
            debug: string;
            delete: string;
            deleteLog: string;
            deleteLogError: string;
            deleteLogsError: string;
            deleteSelected: string;
            destinations: {
                title: string;
                subtitle: string;
                addNew: string;
                refresh: string;
                export: string;
                loading: string;
                loadSuccess: string;
                loadError: string;
                status: {
                    available: string;
                    limited: string;
                    fullybooked: string;
                    unavailable: string;
                };
                stats: {
                    total: string;
                    bookings: string;
                    revenue: string;
                    avgRating: string;
                    featured: string;
                    active: string;
                    totalBookingsDesc: string;
                    totalRevenueDesc: string;
                    totalReviews: string;
                };
                filters: {
                    title: string;
                    clear: string;
                    tabs: {
                        basic: string;
                        advanced: string;
                    };
                    search: string;
                    searchPlaceholder: string;
                    country: string;
                    allCountries: string;
                    category: string;
                    allCategories: string;
                    status: string;
                    allStatus: string;
                    priceRange: string;
                    minRating: string;
                    sortBy: string;
                };
                table: {
                    title: string;
                    page: string;
                    headers: {
                        destination: string;
                        category: string;
                        status: string;
                        price: string;
                        stats: string;
                        actions: string;
                    };
                    empty: string;
                };
                actions: {
                    view: string;
                    clone: string;
                    delete: string;
                    cloneSuccess: string;
                    deleteSuccess: string;
                    bulkDeleteSuccess: string;
                    statusUpdate: string;
                    featuredUpdate: string;
                    addFeatured: string;
                    removeFeatured: string;
                    activate: string;
                    deactivate: string;
                };
                price: {
                    startingFrom: string;
                    perDay: string;
                };
                selection: {
                    count: string;
                    clear: string;
                    delete: string;
                };
                confirmDelete: {
                    title: string;
                    message: string;
                    bulkMessage: string;
                };
            };
            draft: string;
            edit: string;
            enterSearchTerm: string;
            error: string;
            errorLoadingData: string;
            errorOccurred: string;
            expand: string;
            export: string;
            exportAsCSV: string;
            exportAsJSON: string;
            exportError: string;
            exportLogs: string;
            exportSuccess: string;
            failed: string;
            filters: {
                apply: string;
                clear: string;
                search: string;
                status: {
                    all: string;
                    active: string;
                    inactive: string;
                    pending: string;
                    completed: string;
                    cancelled: string;
                };
                date: {
                    today: string;
                    yesterday: string;
                    thisWeek: string;
                    lastWeek: string;
                    thisMonth: string;
                    lastMonth: string;
                    customRange: string;
                };
            };
            financial: {
                title: string;
                dashboardOverview: string;
                revenueVsExpenses: string;
                profitTrend: string;
                expenseCategories: string;
                annualSummary: string;
                totalRevenue: string;
                totalExpenses: string;
                totalProfit: string;
                avgMonthlyProfit: string;
                revenue: string;
                expenses: string;
                profit: string;
                transactions: string;
                noFinancialData: string;
                vsPreviousMonth: string;
                export: string;
                refresh: string;
            };
            footer: {
                adminLabel: string;
                admin: string;
                description: string;
                management: string;
                users: string;
                bookings: string;
                analytics: string;
                settings: string;
                content: string;
                posts: string;
                pages: string;
                media: string;
                newsletters: string;
                ecommerce: string;
                products: string;
                orders: string;
                financial: string;
                destinations: string;
                system: string;
                logs: string;
                maintenance: string;
                backup: string;
                security: string;
                support: string;
                documentation: string;
                supportTech: string;
                privacy: string;
                terms: string;
                quickDashboard: string;
                quickReports: string;
                goTo: string;
                copyrightLabel: string;
                version: string;
                versionLabel: string;
                lastUpdate: string;
            };
            forms: {
                save: string;
                cancel: string;
                delete: string;
                edit: string;
                create: string;
                update: string;
                reset: string;
                submit: string;
                back: string;
                next: string;
                previous: string;
                required: string;
                optional: string;
                success: string;
                error: string;
                warning: string;
                info: string;
                loading: string;
                search: string;
                noResults: string;
                selectPlaceholder: string;
                datePlaceholder: string;
            };
            from: string;
            info: string;
            ip: string;
            level: string;
            loading: string;
            logDeleted: string;
            logDetails: string;
            login: {
                welcome: string;
                subtitle: string;
                title: string;
                emailLabel: string;
                emailPlaceholder: string;
                passwordLabel: string;
                passwordPlaceholder: string;
                rememberMe: string;
                forgotPassword: string;
                submit: string;
                submitting: string;
                noAccount: string;
                registerLink: string;
                notAdmin: string;
                backToSite: string;
            };
            logsDeleted: string;
            message: string;
            logo: {
                link: string;
            };
            logout: string;
            mobile_menu: {
                toggle: string;
                title: string;
            };
            navigation: {
                main: string;
                dashboard: string;
                modernDashboard: string;
                userManagement: string;
                bookingHistory: string;
                destinations: string;
                blogPosts: string;
                newsletters: string;
                financialOverview: string;
                aiAssistant: string;
                reportsAnalytics: string;
                systemLogs: string;
                technicalSupport: string;
                securityControls: string;
                systemSettings: string;
                needHelp: string;
                docs: string;
                readDocs: string;
                systemOnline: string;
                management: string;
                system: string;
                ai_management: string;
                maintenance: string;
                help: string;
                view_site: string;
            };
            noDataAvailable: string;
            noLogs: string;
            noLogsFound: string;
            notifications: {
                success: string;
                error: string;
                warning: string;
                info: string;
                saved: string;
                deleted: string;
                updated: string;
                created: string;
            };
            pagination: {
                itemsPerPage: string;
                of: string;
                previous: string;
                next: string;
                first: string;
                last: string;
            };
            panelTitle: string;
            payment: string;
            pleaseWait: string;
            recentLogs: string;
            refresh: string;
            register: {
                welcome: string;
                subtitle: string;
                title: string;
                errorTitle: string;
                nameLabel: string;
                namePlaceholder: string;
                emailLabel: string;
                emailPlaceholder: string;
                passwordLabel: string;
                passwordPlaceholder: string;
                confirmPasswordLabel: string;
                confirmPasswordPlaceholder: string;
                submit: string;
                submitting: string;
                haveAccount: string;
                loginLink: string;
                backToSite: string;
                copyright: string;
                validation: {
                    required: string;
                    passwordMismatch: string;
                    success: string;
                    error: string;
                };
            };
            retry: string;
            save: string;
            scheduled: string;
            search: {
                placeholder: string;
                aria_label: string;
                no_results: string;
                suggestion_hint: string;
                results_found: string;
                no_results_suggestion: string;
                category_match: string;
                suggestion: string;
            };
            searchInLogs: string;
            security: string;
            selectAll: string;
            sent: string;
            sidebar: {
                label: string;
                footerAriaLabel: string;
            };
            success: string;
            system: string;
            theme: {
                toggle: string;
                Dark: string;
                Light: string;
                System: string;
                Theme: string;
                Simple: string;
            };
            timestamp: string;
            to: string;
            tryAgain: string;
            user: string;
            userAgent: string;
            users: {
                title: string;
                subtitle: string;
                addUserDesc: string;
                editUserDesc: string;
                addNew: string;
                search: string;
                filters: string;
                deleteSelected: string;
                table: {
                    name: string;
                    email: string;
                    role: string;
                    status: string;
                    lastLogin: string;
                    actions: string;
                    joined: string;
                    showing: string;
                    joinDate: string;
                    password: string;
                    empty: string;
                };
                pagination: {
                    previous: string;
                    next: string;
                };
                roles: {
                    all: string;
                    admin: string;
                    editor: string;
                    viewer: string;
                };
                status: {
                    all: string;
                    active: string;
                    inactive: string;
                    suspended: string;
                };
            };
            users_description: string;
            validation: {
                required: string;
                email: string;
                minLength: string;
                maxLength: string;
                passwordsDontMatch: string;
                invalidFormat: string;
                invalidUrl: string;
                invalidDate: string;
            };
            viewLogDetails: string;
            warning: string;
        };
        readonly 'ai-preferences': {
            common: {
                notSet: string;
                unknown: string;
                cancel: string;
                clear: string;
                minutesShort: string;
                ai: string;
            };
            localModel: {
                specs: {
                    model: string;
                    size: string;
                    context: string;
                    memory: string;
                };
                benefits: {
                    zeroApiCosts: string;
                    completePrivacy: string;
                    offlineCapability: string;
                };
            };
            privacyTrust: {
                features: {
                    localProcessing: {
                        title: string;
                        description: string;
                    };
                    dataPrivacy: {
                        title: string;
                        description: string;
                    };
                    noDataCollection: {
                        title: string;
                        description: string;
                    };
                    offlineCapability: {
                        title: string;
                        description: string;
                    };
                };
                trustIndicators: {
                    zeroApiCosts: string;
                    noRateLimits: string;
                    completeDataOwnership: string;
                    gdprCompliant: string;
                    noThirdPartyDependencies: string;
                    openSourceModel: string;
                };
            };
            advancedSettings: {
                performance: {
                    title: string;
                    description: string;
                    cache: {
                        title: string;
                        description: string;
                        active: string;
                        hitRate: string;
                    };
                };
                dataIntegration: {
                    title: string;
                    description: string;
                };
                integrations: {
                    title: string;
                    description: string;
                    enableRealTimeData: string;
                    enableWeatherIntegration: string;
                    enableCurrencyConversion: string;
                };
                experimental: {
                    title: string;
                    description: string;
                    beta: string;
                    warning: string;
                    notAvailable: string;
                };
                metrics: {
                    title: string;
                    averageResponseTime: string;
                    cacheHitRate: string;
                    successRate: string;
                    totalRequests: string;
                };
                apiStatus: {
                    title: string;
                    openai: string;
                    weather: string;
                    currency: string;
                    connected: string;
                    active: string;
                    inactive: string;
                    error: string;
                    disconnected: string;
                };
            };
            aiPoweredFeatures: {
                profileAnalysis: {
                    title: string;
                    empty: string;
                };
                travelerProfile: {
                    title: string;
                    travelerType: string;
                    primaryInterests: string;
                };
            };
            modelTab: {
                hero: {
                    title: string;
                    subtitle: string;
                };
                sections: {
                    modelSelection: {
                        title: string;
                        subtitle: string;
                    };
                    parameters: {
                        title: string;
                        subtitle: string;
                    };
                    aiFeatures: {
                        title: string;
                        subtitle: string;
                        badge: string;
                    };
                    performance: {
                        title: string;
                        subtitle: string;
                    };
                    dataIntegration: {
                        title: string;
                        subtitle: string;
                    };
                };
                labels: {
                    model: string;
                    temperature: string;
                    maxTokens: string;
                    status: string;
                    configured: string;
                    incomplete: string;
                    setupInProgress: string;
                };
                groups: {
                    coreSettings: string;
                    advanced: string;
                };
            };
            welcome: {
                title: string;
                subtitle: string;
                button: string;
            };
            status: {
                synced: string;
                loading: string;
                syncing: string;
                hasChanges: string;
                unsaved: string;
            };
            import: {
                tooltip: string;
                success: string;
                successDescription: string;
            };
            reset: {
                tooltip: string;
                success: string;
                successDescription: string;
                dialog: {
                    title: string;
                    description: string;
                    confirm: string;
                    cancel: string;
                };
            };
            description: string;
            help: {
                message: string;
                contact: string;
                about: string;
            };
            activities: {
                museums: string;
                gastronomy: string;
                nightlife: string;
                shopping: string;
                watersports: string;
                hiking: string;
                photography: string;
                architecture: string;
                festivals: string;
                nature: string;
                beaches: string;
                mountains: string;
                spa: string;
                adventure: string;
                heritage: string;
                hiking_extra: string;
                nightlife_extra: string;
                shopping_extra: string;
                culinary: string;
            };
            currencies: {
                EUR: string;
                USD: string;
                GBP: string;
                BRL: string;
            };
            errorResetting: string;
            errorSaving: string;
            advanced: {
                title: string;
                description: string;
                comingSoon: string;
                recommendations: {
                    title: string;
                    subtitle: string;
                    enabledLabel: string;
                    featuresTitle: string;
                };
                dataSharing: {
                    title: string;
                    subtitle: string;
                    generalLabel: string;
                    personalizedLabel: string;
                    analyticsLabel: string;
                    marketingLabel: string;
                };
                notifications: {
                    title: string;
                    subtitle: string;
                    enabledLabel: string;
                    channelsLabel: string;
                    typesLabel: string;
                    channelSelected: string;
                    channelNotSelected: string;
                };
                loyalty: {
                    title: string;
                    subtitle: string;
                    noPrograms: string;
                    addButton: string;
                };
            };
            languages: {
                pt: string;
                en: string;
                es: string;
                fr: string;
                de: string;
                it: string;
            };
            loading: string;
            loadingStats: string;
            page: {
                title: string;
                subtitle: string;
            };
            modelSettings: {
                title: string;
                description: string;
                selectedModel: string;
                modelInfo: string;
                maxTokens: string;
                costPerToken: string;
                capabilities: string;
                parameters: {
                    title: string;
                    description: string;
                    temperature: {
                        label: string;
                        description: string;
                    };
                    maxTokensParam: {
                        label: string;
                        description: string;
                    };
                    topP: {
                        label: string;
                        description: string;
                    };
                    frequencyPenalty: {
                        label: string;
                        description: string;
                    };
                    presencePenalty: {
                        label: string;
                        description: string;
                    };
                };
            };
            personalization: {
                personality: {
                    title: string;
                    description: string;
                    personalityType: string;
                    professional: {
                        label: string;
                        description: string;
                        example: string;
                    };
                    friendly: {
                        label: string;
                        description: string;
                        example: string;
                    };
                    enthusiastic: {
                        label: string;
                        description: string;
                        example: string;
                    };
                    detailed: {
                        label: string;
                        description: string;
                        example: string;
                    };
                    concise: {
                        label: string;
                        description: string;
                        example: string;
                    };
                };
                responseLength: {
                    title: string;
                    description: string;
                    short: {
                        label: string;
                        description: string;
                    };
                    medium: {
                        label: string;
                        description: string;
                    };
                    detailed: {
                        label: string;
                        description: string;
                    };
                };
                features: {
                    title: string;
                    description: string;
                    includeLocalTips: string;
                    includeBudgetBreakdown: string;
                    includeAlternatives: string;
                };
                settings: {
                    title: string;
                    description: string;
                    selected: string;
                    selectedType: string;
                    stars: string;
                    dietary: {
                        label: string;
                        none_selected: string;
                        removeAriaLabel: string;
                        options: {
                            vegetarian: string;
                            vegan: string;
                            glutenfree: string;
                            dairyfree: string;
                            nutfree: string;
                            lowcarb: string;
                            cholesterolfree: string;
                        };
                    };
                    pacing: {
                        label: string;
                        placeholder: string;
                        none_selected: string;
                        descriptions: {
                            fast: string;
                            moderate: string;
                            slow: string;
                        };
                        fast: string;
                        moderate: string;
                        slow: string;
                    };
                    accessibility: {
                        label: string;
                        none_selected: string;
                        removeAriaLabel: string;
                        options: {
                            screenreader: string;
                            closedcaptions: string;
                            wheelchair: string;
                        };
                    };
                    accommodation: {
                        label: string;
                        placeholder: string;
                        options: {
                            hotel: string;
                            resort: string;
                            airbnb: string;
                            hostel: string;
                            apartment: string;
                            accessible: string;
                        };
                    };
                    cruise: {
                        toggle: {
                            label: string;
                        };
                        hint: string;
                        collapsedHint: string;
                        types: {
                            river: {
                                title: string;
                                subtitle: string;
                            };
                            sea: {
                                title: string;
                                subtitle: string;
                            };
                        };
                        regions: {
                            riverTitle: string;
                            seaTitle: string;
                            options: {
                                european: string;
                                asian: string;
                                african: string;
                                american: string;
                                caribbean: string;
                                mediterranean: string;
                                alaska: string;
                                nordic: string;
                                transatlantic: string;
                            };
                        };
                        duration: {
                            title: string;
                            options: {
                                short: {
                                    label: string;
                                    days: string;
                                };
                                medium: {
                                    label: string;
                                    days: string;
                                };
                                long: {
                                    label: string;
                                    days: string;
                                };
                            };
                        };
                        cabin: {
                            title: string;
                            options: {
                                interior: {
                                    label: string;
                                    description: string;
                                };
                                oceanview: {
                                    label: string;
                                    description: string;
                                };
                                balcony: {
                                    label: string;
                                    description: string;
                                };
                                suite: {
                                    label: string;
                                    description: string;
                                };
                            };
                        };
                    };
                };
            };
            review: {
                ready: string;
                hint: string;
                completeSetup: string;
                modifyLater: string;
                enabled: string;
                disabled: string;
                missing: string;
                complete: string;
                applied: string;
                sections: {
                    basics: {
                        title: string;
                    };
                    personalization: {
                        title: string;
                    };
                    travel: {
                        title: string;
                    };
                    model: {
                        title: string;
                    };
                    privacy: {
                        title: string;
                    };
                };
                fields: {
                    activities: string;
                    budget: string;
                    destination: string;
                    dates: string;
                    travelers: string;
                    model: string;
                    creativity: string;
                    responseLength: string;
                    dataSharing: string;
                    analytics: string;
                    notifications: string;
                };
            };
            preferencesReset: string;
            preferencesSaved: string;
            preferencesUpdated: string;
            privacySettings: {
                title: string;
                description: string;
                saveSearchHistory: string;
                shareDataForImprovement: string;
                allowPersonalization: string;
            };
            restoreDefaults: string;
            saveChanges: string;
            saving: string;
            subtitle: string;
            title: string;
            model: {
                title: string;
                description: string;
                selectedModel: string;
                modelInfo: {
                    title: string;
                };
                maxTokens: string;
                costPerToken: string;
                costWarning: {
                    title: string;
                    message: string;
                };
                resetToDefaults: string;
                status: {
                    available: string;
                    unavailable: string;
                    comingSoon: string;
                };
                estimatedMonthlyCost: string;
                performance: {
                    title: string;
                    speed: string;
                    accuracy: string;
                    creativity: string;
                };
                capabilities: {
                    title: string;
                };
            };
            parameters: {
                title: string;
                description: string;
                temperature: {
                    label: string;
                    description: string;
                    levels: {
                        focused: string;
                        balanced: string;
                        creative: string;
                    };
                };
                maxTokens: {
                    label: string;
                    description: string;
                    words: string;
                };
                topP: {
                    label: string;
                    description: string;
                };
                frequencyPenalty: {
                    label: string;
                    description: string;
                };
                presencePenalty: {
                    label: string;
                    description: string;
                };
                advanced: {
                    title: string;
                };
            };
            travelPreferences: {
                budget: {
                    title: string;
                    description: string;
                    badge: string;
                    currencyLabel: string;
                    currencyPlaceholder: string;
                    rangeLabel: string;
                    maxBudgetPercent: string;
                    info: string;
                    defaultTitle: string;
                    rangeTitle: string;
                    rangeSubtitle: string;
                    amplitude: string;
                    presetAriaLabel: string;
                    minLabel: string;
                    maxLabel: string;
                    minTooltip: string;
                    maxTooltip: string;
                    visualizationTitle: string;
                    minShort: string;
                    available: string;
                    errors: {
                        multipleIssues: string;
                    };
                    presets: {
                        economic: string;
                        balanced: string;
                        premium: string;
                    };
                };
                travelStyle: {
                    title: string;
                    description: string;
                    travelersLabel: string;
                    selector: {
                        title: string;
                        subtitle: string;
                        selected: string;
                        recommendedActivities: string;
                    };
                    types: {
                        luxury: {
                            label: string;
                            description: string;
                        };
                        comfort: {
                            label: string;
                            description: string;
                        };
                        budget: {
                            label: string;
                            description: string;
                        };
                        adventure: {
                            label: string;
                            description: string;
                        };
                        cultural: {
                            label: string;
                            description: string;
                        };
                        relaxation: {
                            label: string;
                            description: string;
                        };
                    };
                    luxury: {
                        label: string;
                        description: string;
                    };
                    comfort: {
                        label: string;
                        description: string;
                    };
                    budget: {
                        label: string;
                        description: string;
                    };
                    adventure: {
                        label: string;
                        description: string;
                    };
                    cultural: {
                        label: string;
                        description: string;
                    };
                    relaxation: {
                        label: string;
                        description: string;
                    };
                };
                sustainability: {
                    title: string;
                    description: string;
                    levelLabel: string;
                    levelDescription: string;
                    ecoLabel: string;
                    ecoDescription: string;
                    infoTooltip: string;
                    certificationsLabel: string;
                    certificationsDescription: string;
                    summaryTitle: string;
                    summaryBody: string;
                    impactLevels: {
                        excellent: string;
                        good: string;
                        moderate: string;
                        tobetter: string;
                    };
                    indicators: {
                        low: string;
                        high: string;
                        score: string;
                    };
                    low: {
                        label: string;
                        description: string;
                        impact: string;
                    };
                    medium: {
                        label: string;
                        description: string;
                        impact: string;
                    };
                    high: {
                        label: string;
                        description: string;
                        impact: string;
                    };
                    ecoPreferencesOptions: {
                        carbon_offsetting: {
                            label: string;
                            description: string;
                        };
                        eco_hotels: {
                            label: string;
                            description: string;
                        };
                        public_transport: {
                            label: string;
                            description: string;
                        };
                        local_food: {
                            label: string;
                            description: string;
                        };
                        wildlife_protection: {
                            label: string;
                            description: string;
                        };
                        water_conservation: {
                            label: string;
                            description: string;
                        };
                        renewable_energy: {
                            label: string;
                            description: string;
                        };
                        zero_waste: {
                            label: string;
                            description: string;
                        };
                    };
                    certificationsOptions: {
                        leed: {
                            label: string;
                            description: string;
                        };
                        green_key: {
                            label: string;
                            description: string;
                        };
                        blue_flag: {
                            label: string;
                            description: string;
                        };
                        earth_check: {
                            label: string;
                            description: string;
                        };
                        green_globe: {
                            label: string;
                            description: string;
                        };
                        eco_label: {
                            label: string;
                            description: string;
                        };
                        none: {
                            label: string;
                            description: string;
                        };
                    };
                };
                travelers: {
                    title: string;
                    description: string;
                };
                activities: {
                    title: string;
                    description: string;
                    addActivity: string;
                    popularActivities: string;
                    selectedLabel: string;
                    clearAll: string;
                    availableLabel: string;
                    limitReached: string;
                    searchPlaceholder: string;
                    limitAlert: string;
                    alreadySelected: string;
                    selectActivity: string;
                    removeActivity: string;
                };
                suggestions: {
                    title: string;
                    available: string;
                    match: string;
                    potentialSavings: string;
                    category: string;
                    moreAvailable: string;
                    footer: string;
                    dismiss: string;
                    sugestion: string;
                };
            };
            usageAnalytics: {
                title: string;
                totalRequests: string;
                tokensUsed: string;
                averageResponseTime: string;
                successRate: string;
                favoriteFeatures: string;
                monthlyUsage: string;
                performanceInsights: string;
                performanceInsightsDescription: string;
                usagePatterns: string;
                mostActiveTime: string;
                preferredDay: string;
                avgSessionDuration: string;
                recommendations: string;
                optimization: string;
                optimizationDesc: string;
                personalization: string;
                personalizationDesc: string;
                achievement: string;
                achievementDesc: string;
                monthlyUsageDescription: string;
                monthlyGrowth: string;
                favoriteFeaturesDescription: string;
            };
            dashboard: {
                intelligenceScore: string;
                configurationSteps: string;
                overallProgress: string;
                scoreCards: {
                    intelligence: {
                        title: string;
                        subtitle: string;
                    };
                    traveler: {
                        title: string;
                        subtitle: string;
                    };
                    sustainability: {
                        title: string;
                        subtitle: string;
                    };
                };
                navigation: {
                    previous: string;
                    continue: string;
                    completeSetup: string;
                };
                auth: {
                    saveTitle: string;
                    saveDescription: string;
                    loginButton: string;
                };
            };
            steps: {
                profile: {
                    label: string;
                    description: string;
                };
                style: {
                    label: string;
                    description: string;
                };
                budget: {
                    label: string;
                    description: string;
                };
                preferences: {
                    label: string;
                    description: string;
                };
                activities: {
                    label: string;
                    description: string;
                };
                accessibility: {
                    label: string;
                    description: string;
                };
                settings: {
                    label: string;
                    description: string;
                };
            };
            languageSelection: {
                title: string;
                selectedTitle: string;
                addLanguage: string;
                chooseLanguage: string;
                noneSelected: string;
                searchPlaceholder: string;
                noResults: string;
                recommendationsTitle: string;
                clickToAdd: string;
                proficiency: string;
                basic: string;
                intermediate: string;
                fluent: string;
                chooseProficiency: string;
            };
            days: {
                monday: string;
                tuesday: string;
                wednesday: string;
                thursday: string;
                friday: string;
                saturday: string;
                sunday: string;
            };
            form: {
                title: string;
                saveDraft: string;
                next: string;
                previous: string;
                complete: string;
                completedSuccess: string;
                completedError: string;
                tabs: {
                    basics: string;
                    budget: string;
                    personalization: string;
                    sustainable: string;
                    model: string;
                    privacy: string;
                };
            };
        };
        readonly auth: {
            accessDenied: string;
            back_to_home: string;
            create_account: string;
            email_label: string;
            email_placeholder: string;
            exclusive_trips: string;
            facebook_sign_in: string;
            forgot_password: string;
            google_sign_in: string;
            insufficientPermissions: string;
            invalid_credentials: string;
            login: {
                title: string;
                subtitle: string;
                email: string;
                emailRequired: string;
                invalidEmail: string;
                password: string;
                passwordRequired: string;
                passwordMinLength: string;
                rememberMe: string;
                signIn: string;
                orSignInWithEmail: string;
            };
            loginRequired: string;
            no_account: string;
            or: string;
            password_label: string;
            password_placeholder: string;
            pleaseLoginToContinue: string;
            register: string;
            remember_me: string;
            required_fields: string;
            secure: string;
            sign_in: string;
            signing_in: string;
            subtitle: string;
            success: string;
            support: string;
            unexpected_error: string;
            welcome: string;
        };
        readonly blog: {
            back: string;
            categories: {
                destinos: string;
                "consejos-de-viaje": string;
                aventura: string;
                gastronomia: string;
                ecoturismo: string;
                cultura: string;
                itinerarios: string;
                Destinos: string;
                "Dicas de Viagem": string;
                Aventura: string;
                Gastronomia: string;
                Ecoturismo: string;
                Cultura: string;
                Roteiros: string;
            };
            featured: {
                title: string;
                subtitle: string;
                readArticle: string;
            };
            footer: {
                copyright: string;
                terms: string;
                privacy: string;
            };
            hero: {
                badge: string;
                title: string;
                subtitle: string;
            };
            loadMore: string;
            meta: {
                title: string;
                description: string;
                keywords: string;
            };
            posts: {
                title: string;
                readMore: string;
                readTime: string;
                backToBlog: string;
                resultsFound: string;
                noResults: {
                    title: string;
                    description: string;
                };
            };
            relatedDestinations: string;
            relatedPosts: string;
            relatedServices: string;
            search: {
                placeholder: string;
                allCategories: string;
            };
            sidebar: {
                recentPosts: string;
                newsletter: {
                    title: string;
                    description: string;
                    placeholder: string;
                    subscribe: string;
                    success: string;
                    error: string;
                };
            };
            filtersPanel: {
                title: string;
                clear: string;
                search: {
                    label: string;
                    placeholder: string;
                };
                category: {
                    label: string;
                    placeholder: string;
                };
                tag: {
                    label: string;
                    placeholder: string;
                };
                sort: {
                    label: string;
                    options: {
                        recent: string;
                        popular: string;
                        az: string;
                        za: string;
                    };
                };
                updating: string;
            };
            searchAndFilter: {
                search: {
                    placeholder: string;
                    submit: string;
                };
            };
            newsletterInline: {
                title: string;
                description: string;
                emailPlaceholder: string;
                subscribe: string;
            };
            popularCategories: {
                title: string;
                items: {
                    beaches: string;
                    ecotourism: string;
                    gastronomy: string;
                    culture: string;
                    adventure: string;
                };
            };
            grid: {
                range: {
                    empty: string;
                    showing: string;
                };
                noResults: {
                    title: string;
                    titleWithQuery: string;
                    description: string;
                    descriptionWithQuery: string;
                    viewAll: string;
                };
                activeFilters: {
                    category: string;
                    tag: string;
                    search: string;
                    clearAll: string;
                };
                pagination: {
                    previous: string;
                    next: string;
                    page: string;
                };
            };
            article: {
                actions: {
                    viewAll: string;
                };
                loadError: {
                    title: string;
                    description: string;
                };
                content: {
                    unavailable: string;
                    loading: string;
                };
                footer: {
                    lastUpdated: string;
                };
                meta: {
                    readingTimeMinutes: string;
                    siteNameFallback: string;
                    fallbackDescription: string;
                    fallbackOpenGraphTitle: string;
                    fallbackOpenGraphDescription: string;
                    twitterHandleFallback: string;
                    notFoundTitle: string;
                };
            };
        };
        readonly booking: {
            buttons: {
                back: string;
                continue: string;
                confirm: string;
            };
            destinations: {
                santorini: {
                    name: string;
                    duration: string;
                    includes: string[];
                };
                tokyo: {
                    name: string;
                    duration: string;
                    includes: string[];
                };
                bali: {
                    name: string;
                    duration: string;
                    includes: string[];
                };
            };
            pageTitle: string;
            perPersonSuffix: string;
            step1: {
                title: string;
                departureDate: string;
                returnDate: string;
                travelers: string;
                travelerCount_one: string;
                travelerCount_other: string;
                accommodation: {
                    title: string;
                    options: {
                        standard: string;
                        premium: string;
                        luxury: string;
                    };
                    pricePrefix: string;
                    included: string;
                };
                specialRequests: {
                    label: string;
                    placeholder: string;
                };
            };
            step2: {
                title: string;
                fullName: string;
                fullNamePlaceholder: string;
                email: string;
                emailPlaceholder: string;
                phone: string;
                phonePlaceholder: string;
                document: string;
                documentPlaceholder: string;
                security: {
                    title: string;
                    description: string;
                };
            };
            step3: {
                title: string;
                travelerCount_one: string;
                travelerCount_other: string;
                rating: string;
                priceDetails: {
                    title: string;
                    basePackage: string;
                    accommodationUpgrade: string;
                    taxes: string;
                };
                included: {
                    title: string;
                    travelInsurance: string;
                    support: string;
                };
                policies: {
                    title: string;
                    cancellation: string;
                    changes: string;
                    documentation: string;
                    vaccines: string;
                };
                total: string;
            };
            step4: {
                title: string;
                paymentMethod: {
                    title: string;
                    credit: {
                        name: string;
                        description: string;
                    };
                    pix: {
                        name: string;
                        description: string;
                    };
                };
                creditCard: {
                    number: string;
                    numberPlaceholder: string;
                    expiry: string;
                    expiryPlaceholder: string;
                    cvv: string;
                    cvvPlaceholder: string;
                    name: string;
                    namePlaceholder: string;
                };
                pix: {
                    title: string;
                    description: string;
                    totalWithDiscount: string;
                };
                terms: {
                    agree: string;
                    service: string;
                    privacy: string;
                };
                orderSummary: {
                    title: string;
                    subtotal: string;
                    taxes: string;
                    pixDiscount: string;
                    securePayment: string;
                    instantConfirmation: string;
                };
            };
        };
        readonly bookings: {
            bookNow: string;
            getStarted: string;
            noBookings: string;
            subtitle: string;
            title: string;
        };
        readonly careers: {
            hero: {
                title: string;
                subtitle: string;
                badge: string;
            };
            benefits: {
                title: string;
                health: string;
                health_desc: string;
                flex: string;
                flex_desc: string;
                growth: string;
                growth_desc: string;
                tech: string;
                tech_desc: string;
            };
            cta: {
                badge: string;
                title: string;
                subtitle: string;
                button: string;
            };
            form: {
                title: string;
            };
            application: {
                title: string;
                close: string;
                name: string;
                email: string;
                phone: string;
                linkedin: string;
                message: {
                    label: string;
                    placeholder: string;
                };
                cv: {
                    label: string;
                    upload: string;
                    drag: string;
                    format: string;
                };
                error: string;
                submitting: string;
                submit: string;
                success: {
                    title: string;
                    message: string;
                };
            };
            job: {
                none: string;
                checkback: string;
                spontaneous: string;
                apply: {
                    label: string;
                    aria: string;
                };
                requirements_label: string;
                benefits_label: string;
            };
            jobs: {
                empty: {
                    title: string;
                    department: string;
                    general: string;
                    checkback: string;
                };
            };
            departments: {
                empty: {
                    title: string;
                    subtitle: string;
                };
            };
            open_positions: string;
            opportunities: string;
            sections: {
                whyJoinUs: {
                    title: string;
                    description: string;
                };
                openPositions: {
                    title: string;
                    noPositions: string;
                };
            };
        };
        readonly chat: {
            inputPlaceholder: string;
            openChat: string;
            talkToUs: string;
            title: string;
            welcome: string;
            welcomeMessage: string;
        };
        readonly common: {
            tryAgain: string;
            close: string;
            actions: string;
            slogan: string;
            phone: string;
            email: string;
            address: {
                city: string;
                street: string;
            };
            ui: {
                edit: string;
                loading: string;
                error: string;
                retry: string;
                close: string;
                save: string;
                cancel: string;
                confirm: string;
                delete: string;
                view: string;
                show: string;
                show_less: string;
                show_more: string;
                hide: string;
                add: string;
                remove: string;
                create: string;
                update: string;
                submit: string;
                search: string;
                select: string;
                choose: string;
                book: string;
                join: string;
                overview: string;
                notAvailable: string;
                emailPlaceholder: string;
            };
            available: string;
            booking: string;
            searching: string;
            day: string;
            days: string;
            roundTrip: string;
            returnDate: string;
            header: {
                brand: string;
                tagline: string;
                menu: string;
                notifications: string;
                profile: string;
                settings: string;
                billing: string;
                help: string;
                login: string;
                logout: string;
                user: string;
            };
            theme: {
                dark: string;
                light: string;
                toggleTitle: string;
                moreOptions: string;
                toggleAriaLabel: string;
                switchToDark: string;
                toggle: string;
            };
            admin: {
                actions: string;
                edit: string;
                dashboard: string;
                users: string;
                settings: string;
                blog: {
                    title: string;
                    posts: string;
                    create_post: string;
                    title_placeholder: string;
                    content_placeholder: string;
                    draft: string;
                    published: string;
                    create: string;
                    existing_posts: string;
                    slug: string;
                    date: string;
                    status: string;
                };
                social: {
                    posts: string;
                    create_post: string;
                    content_placeholder: string;
                    schedule: string;
                    existing_posts: string;
                    platform: string;
                    content: string;
                    scheduled_date: string;
                    status: string;
                };
                sustainable_travel: {
                    title: string;
                    page_content: string;
                    add_initiative: string;
                    hero_title: string;
                    hero_description: string;
                    mission_statement: string;
                    initiatives: string;
                    initiative_title: string;
                    initiative_description: string;
                };
            };
            auth: {
                login: string;
                register: string;
            };
            buttons: {
                getStarted: string;
            };
            cancel: string;
            company: {
                founder: string;
                founderAlt: string;
                founderTitle: string;
                slogan: string;
                name: string;
                address: string;
                phone: string;
                email: string;
            };
            companyInfo: {
                name: string;
                slogan: string;
                address: string;
                phone: string;
            };
            delete: string;
            dismiss: string;
            edit: string;
            explore_now: string;
            featured: string;
            form: {
                activities: string;
                additionalInfo: string;
                budget: string;
                dates: string;
                destinations: string;
                dietary: string;
                duration: string;
                email: string;
                groupSize: string;
                name: string;
                personalInfo: string;
                phone: string;
                specialRequests: string;
                submit: string;
                travelStyle: string;
            };
            high: string;
            learnMore: string;
            loading: string;
            low: string;
            medium: string;
            newsletter: {
                stayUpdated: string;
                dealsAndNews: string;
                description: string;
                emailLabel: string;
                emailPlaceholder: string;
                subscribeButton: string;
                title: string;
            };
            partnerships: {
                title: string;
                dg: string;
                gea: string;
                sanjotec: string;
                turismodeportugal: string;
            };
            paymentMethods: {
                transfer: string;
            };
            profile: {
                account_menu: string;
                profile: string;
                logout: string;
                logout_success: string;
                personal: string;
                contact: string;
                preferences: string;
                payment: string;
                privacy: string;
                title: string;
                description: string;
                edit: string;
                newsletter: {
                    title: string;
                    subtitle: string;
                };
                buttons: {
                    newCampaign: string;
                    refreshList: string;
                };
                stats: {
                    totalSubscribers: string;
                    activeSubscribers: string;
                    totalCampaigns: string;
                    sentCampaigns: string;
                    avgOpenRate: string;
                    avgOpenRateDesc: string;
                };
                tabs: {
                    campaigns: string;
                    subscribers: string;
                    templates: string;
                    analytics: string;
                };
                tableHeaders: {
                    subject: string;
                    status: string;
                    recipients: string;
                    sentAt: string;
                    openRate: string;
                    createdAt: string;
                    email: string;
                    name: string;
                    language: string;
                    tags: string;
                    actions: string;
                };
                subscribers: {
                    title: string;
                    description: string;
                    searchPlaceholder: string;
                    noData: string;
                };
                templates: {
                    title: string;
                    description: string;
                };
                analytics: {
                    title: string;
                    description: string;
                };
                completeness: string;
                complete: string;
                email_verified: string;
                phone_not_verified: string;
                personal_data: string;
                personal_data_description: string;
                first_name: string;
                last_name: string;
                email: string;
                phone: string;
                date_of_birth: string;
                nationality: string;
                tax_id: string;
                gender: string;
                male: string;
                female: string;
                other: string;
                prefer_not_to_say: string;
                marital_status: string;
                single: string;
                married: string;
                divorced: string;
                widowed: string;
                address: string;
                address_description: string;
                street: string;
                number: string;
                complement: string;
                neighborhood: string;
                city: string;
                state: string;
                postal_code: string;
                country: string;
                travel_preferences: string;
                travel_preferences_description: string;
                preferred_currency: string;
                euro: string;
                us_dollar: string;
                british_pound: string;
                brazilian_real: string;
                preferred_language: string;
                portuguese: string;
                english: string;
                spanish: string;
                french: string;
                payment_methods: string;
                payment_methods_description: string;
                no_payment_methods: string;
                add_payment_method: string;
                add_payment_method_button: string;
                privacy_settings: string;
                privacy_settings_description: string;
                profile_visibility: string;
                show_email: string;
                show_email_description: string;
                show_phone: string;
                show_phone_description: string;
                show_address: string;
                show_address_description: string;
                notifications: string;
                marketing_emails: string;
                marketing_emails_description: string;
                sms_notifications: string;
                sms_notifications_description: string;
                push_notifications: string;
                push_notifications_description: string;
                data_sharing: string;
                share_data_with_partners: string;
                share_data_with_partners_description: string;
            };
            routeTransition: {
                loading: string;
            };
            save: string;
            search: string;
            smartForm: {
                title: string;
                subtitle: string;
                success: {
                    title: string;
                    message: string;
                    button: string;
                };
                fields: {
                    destination: string;
                    dateFrom: string;
                    dateTo: string;
                    travelers: string;
                    travelType: string;
                    budget: string;
                    name: string;
                    phone: string;
                    email: string;
                    message: string;
                };
                placeholders: {
                    destination: string;
                    travelers: string;
                    travelType: string;
                    budget: string;
                    name: string;
                    phone: string;
                    email: string;
                    message: string;
                };
                errors: {
                    nameRequired: string;
                    emailRequired: string;
                    emailInvalid: string;
                    phoneRequired: string;
                    destinationRequired: string;
                    travelTypeRequired: string;
                    budgetRequired: string;
                };
                reset: string;
                submit: string;
                submitting: string;
            };
            socialMediaTitle: string;
            socials: {
                facebookUrl: string;
                instagramUrl: string;
                twitterUrl: string;
            };
            submit: string;
            viewAll: string;
            nav: {
                destinations: string;
                flights: string;
                hotels: string;
                community: string;
                demo: string;
            };
            legal: {
                terms: string;
                privacy: string;
                cookies: string;
                gdpr: string;
                cancellation: string;
            };
            mobile: {
                app: string;
            };
            help: {
                documentation: string;
            };
        };
        readonly community: {
            actions: {
                like: string;
                comment: string;
                share: string;
                save: string;
                report: string;
                follow: string;
                unfollow: string;
                edit: string;
                delete: string;
            };
            hero: {
                title: string;
                subtitle: string;
            };
            notifications: {
                title: string;
                markAllRead: string;
                noNotifications: string;
                newPost: string;
                newComment: string;
                newFollower: string;
                eventReminder: string;
                challengeUpdate: string;
            };
            profile: {
                posts: string;
                followers: string;
                following: string;
                joinedDate: string;
                location: string;
                bio: string;
                travelStats: string;
                countriesVisited: string;
                tripsCompleted: string;
                badges: string;
            };
            sections: {
                feed: {
                    title: string;
                    createPost: string;
                    placeholder: string;
                    postButton: string;
                    noContent: string;
                };
                categories: {
                    title: string;
                    all: string;
                    experiences: string;
                    tips: string;
                    photos: string;
                    reviews: string;
                    questions: string;
                    recommendations: string;
                };
                trending: {
                    title: string;
                    destinations: string;
                    discussions: string;
                    members: string;
                };
                groups: {
                    title: string;
                    joinGroup: string;
                    createGroup: string;
                    myGroups: string;
                    discover: string;
                    members: string;
                    posts: string;
                };
                events: {
                    title: string;
                    upcoming: string;
                    past: string;
                    createEvent: string;
                    joinEvent: string;
                    interested: string;
                    going: string;
                    date: string;
                    location: string;
                    attendees: string;
                };
                leaderboard: {
                    title: string;
                    topContributors: string;
                    mostActive: string;
                    points: string;
                    contributions: string;
                };
                challenges: {
                    title: string;
                    active: string;
                    completed: string;
                    participate: string;
                    reward: string;
                    deadline: string;
                };
            };
        };
        readonly consent: {
            banner: {
                title: string;
                description: string;
                acceptAll: string;
                rejectAll: string;
                customize: string;
                necessary: string;
            };
            categories: {
                necessary: {
                    name: string;
                    description: string;
                    examples: {
                        session: string;
                        security: string;
                        cart: string;
                    };
                };
                functional: {
                    name: string;
                    description: string;
                    examples: {
                        language: string;
                        theme: string;
                        preferences: string;
                    };
                };
                analytics: {
                    name: string;
                    description: string;
                    examples: {
                        usage: string;
                        performance: string;
                        errors: string;
                    };
                };
                marketing: {
                    name: string;
                    description: string;
                    examples: {
                        ads: string;
                        social: string;
                        retargeting: string;
                    };
                };
            };
            legal: {
                learnMore: string;
                privacyPolicy: string;
                cookiePolicy: string;
                dataRetention: string;
            };
            modal: {
                title: string;
                description: string;
                save: string;
                cancel: string;
                acceptAll: string;
                rejectAll: string;
            };
            preferences: {
                title: string;
                lastUpdated: string;
                change: string;
                export: string;
                delete: string;
            };
        };
        readonly contact: {
            contactInfo: {
                items: {
                    icon: string;
                    title: string;
                    details: string[];
                }[];
            };
            faq: {
                title: string;
                subtitle: string;
                items: {
                    question: string;
                    answer: string;
                }[];
            };
            form: {
                title: string;
                subtitle: string;
                fields: {
                    name: {
                        label: string;
                        placeholder: string;
                    };
                    email: {
                        label: string;
                        placeholder: string;
                    };
                    phone: {
                        label: string;
                        placeholder: string;
                    };
                    travelType: {
                        label: string;
                        placeholder: string;
                    };
                    subject: {
                        label: string;
                        placeholder: string;
                    };
                    message: {
                        label: string;
                        placeholder: string;
                    };
                };
                travelTypes: {
                    value: string;
                    label: string;
                }[];
                submitButton: string;
                submittingText: string;
                privacyNotice: string;
                success: {
                    title: string;
                    message: string;
                };
            };
            hero: {
                badge: string;
                title: string;
                subtitle: string;
            };
            map: {
                title: string;
                subtitle: string;
            };
            quickActions: {
                title: string;
                chat: string;
                call: string;
                schedule: string;
            };
            testimonials: {
                title: string;
                subtitle: string;
                items: {
                    name: string;
                    location: string;
                    rating: number;
                    comment: string;
                }[];
            };
        };
        readonly cruises: {
            destinations: {
                caribbean: string;
                caribbean_desc: string;
                mediterranean: string;
                mediterranean_desc: string;
                alaska: string;
                alaska_desc: string;
                norway: string;
                norway_desc: string;
            };
            hero: {
                title: string;
                subtitle: string;
            };
            popularDestinations: {
                title: string;
                subtitle: string;
            };
            search: {
                destination: string;
                destination_placeholder: string;
                date: string;
                cruise_line: string;
                cruise_line_placeholder: string;
                button: string;
            };
            whyChooseUs: {
                title: string;
                subtitle: string;
                exclusive: string;
                exclusive_desc: string;
                luxury: string;
                luxury_desc: string;
                support: string;
                support_desc: string;
            };
        };
        readonly dashboard: {
            dashboard: {
                title: string;
                subtitle: string;
                upcomingTrips: string;
                noUpcomingTrips: string;
                recentBookings: string;
                noRecentBookings: string;
                recommendations: string;
                noRecommendations: string;
            };
        };
        readonly demo: {
            meta: {
                title: string;
                description: string;
            };
            hero: {
                badge: string;
                title: string;
                titleHighlight: string;
                subtitle: string;
                cta: string;
                ctaSecondary: string;
                privacyNote: string;
            };
            flow: {
                title: string;
                subtitle: string;
                phases: {
                    landing: string;
                    preferences: string;
                    searching: string;
                    results: string;
                };
                phaseDescriptions: {
                    landing: string;
                    preferences: string;
                    searching: string;
                    results: string;
                };
            };
            tabs: {
                basics: {
                    title: string;
                    description: string;
                    details: string[];
                };
                budget: {
                    title: string;
                    description: string;
                    details: string[];
                };
                personalization: {
                    title: string;
                    description: string;
                    details: string[];
                };
                sustainability: {
                    title: string;
                    description: string;
                    details: string[];
                };
                model: {
                    title: string;
                    description: string;
                    details: string[];
                };
                privacy: {
                    title: string;
                    description: string;
                    details: string[];
                };
                review: {
                    title: string;
                    description: string;
                    details: string[];
                };
            };
            search: {
                title: string;
                subtitle: string;
                processing: string;
                analyzing: string;
                matching: string;
                complete: string;
                localBadge: string;
                noDataLeaves: string;
            };
            privacy: {
                sectionTitle: string;
                sectionSubtitle: string;
                localLlm: {
                    title: string;
                    description: string;
                };
                noCloud: {
                    title: string;
                    description: string;
                };
                encrypted: {
                    title: string;
                    description: string;
                };
                openSource: {
                    title: string;
                    description: string;
                };
                yourData: {
                    title: string;
                    description: string;
                };
                gdpr: {
                    title: string;
                    description: string;
                };
            };
            features: {
                sectionTitle: string;
                sectionSubtitle: string;
                aiPowered: {
                    title: string;
                    description: string;
                };
                multiTab: {
                    title: string;
                    description: string;
                };
                ecoConscious: {
                    title: string;
                    description: string;
                };
                modelChoice: {
                    title: string;
                    description: string;
                };
                privacyFirst: {
                    title: string;
                    description: string;
                };
                smartSearch: {
                    title: string;
                    description: string;
                };
            };
            cta: {
                title: string;
                subtitle: string;
                button: string;
                footnote: string;
            };
            common: {
                step: string;
                of: string;
                next: string;
                back: string;
                startOver: string;
                learnMore: string;
            };
        };
        readonly destinations: {
            allDestinations: string;
            amazing: string;
            contactUsButton: string;
            contactUsForMoreInfo: string;
            destination1Description: string;
            destination1Name: string;
            destination2Description: string;
            destination2Name: string;
            destinationsFound: string;
            destinationsTitle: string;
            discoverUniquePlaces: string;
            exploreTheWorld: string;
            featuredDestinations: string;
            mostSoughtAfter: string;
            noDestinationsFound: string;
            ourServices: string;
            readyToExplore: string;
            searchDestinations: string;
            selectContinent: string;
            selectPriceRange: string;
            service1Description: string;
            service1Name: string;
            service2Description: string;
            service2Name: string;
            tryAdjustingFilters: string;
            page: {
                featured: {
                    editorialLabel: string;
                    title: string;
                };
                results: {
                    showingPrefix: string;
                    of: string;
                    destinations: string;
                };
                countries: {
                    label: string;
                    more: string;
                };
                filters: {
                    title: string;
                };
                newsletter: {
                    eyebrow: string;
                    title: string;
                    description: string;
                };
            };
        };
        readonly errors: {
            es: {
                "404": string;
                "500": string;
                unauthorized: string;
                forbidden: string;
                notFound: string;
                notImplemented: string;
                badGateway: string;
                "Server Error": string;
                "Service Unavailable": string;
            };
        };
        readonly faq: {
            answers: {
                bp_howToBook: string;
                bp_paymentMethods: string;
                bp_installments: string;
                cc_policy: string;
                cc_canIChange: string;
                dt_passport: string;
                dt_visa: string;
                dt_travelInsurance: string;
                dt_healthRequirements: string;
                ds_popularDestinations: string;
                ds_customPackages: string;
                ds_groupTravel: string;
                ds_localGuides: string;
                lc_agencyObligations: string;
                lc_travelerRights: string;
                lc_complaints: string;
                lc_rnavt: string;
                sc_contactMethods: string;
                sc_emergencySupport: string;
                sc_responseTime: string;
                sc_languages: string;
            };
            categories: {
                bookingPayment: string;
                cancellationsChanges: string;
                documentationTravel: string;
                destinationsServices: string;
                legalCompliance: string;
                supportContacts: string;
            };
            contactDetails: {
                phone: string;
                email: string;
            };
            hero: {
                title: string;
                subtitle: string;
            };
            linkTexts: {
                lre: string;
            };
            noResults: string;
            notFound: {
                title: string;
                description: string;
                contactUs: string;
            };
            questions: {
                bp_howToBook: string;
                bp_paymentMethods: string;
                bp_installments: string;
                cc_policy: string;
                cc_canIChange: string;
                dt_passport: string;
                dt_visa: string;
                dt_travelInsurance: string;
                dt_healthRequirements: string;
                ds_popularDestinations: string;
                ds_customPackages: string;
                ds_groupTravel: string;
                ds_localGuides: string;
                lc_agencyObligations: string;
                lc_travelerRights: string;
                lc_complaints: string;
                lc_rnavt: string;
                sc_contactMethods: string;
                sc_emergencySupport: string;
                sc_responseTime: string;
                sc_languages: string;
            };
            searchPlaceholder: string;
        };
        readonly features: {
            categories: {
                core: string;
                advanced: string;
                premium: string;
            };
            cta: {
                title: string;
                subtitle: string;
            };
            features: {
                aiPlanning: {
                    title: string;
                    description: string;
                };
                secureBooking: {
                    title: string;
                    description: string;
                };
                globalDestinations: {
                    title: string;
                    description: string;
                };
                community: {
                    title: string;
                    description: string;
                };
                analytics: {
                    title: string;
                    description: string;
                };
            };
            subtitle: string;
            title: string;
        };
        readonly flights: {
            booking: {
                title: string;
                description: string;
                flightDetails: string;
                passengerInfo: string;
                name: string;
                email: string;
                phone: string;
                totalPrice: string;
                confirm: string;
                cancel: string;
                bookingSuccess: string;
                bookingError: string;
            };
            contactCta: {
                title: string;
                description: string;
                cta: string;
            };
            flightTypes: {
                title: string;
                subtitle: string;
                international: {
                    title: string;
                    description: string;
                };
                domestic: {
                    title: string;
                    description: string;
                };
                group: {
                    title: string;
                    description: string;
                };
                learnMore: string;
            };
            flights: {
                popular: {
                    newYork: string;
                    london: string;
                    paris: string;
                    tokyo: string;
                };
            };
            hero: {
                title: string;
                subtitle: string;
                description: string;
            };
            popularFlights: {
                title: string;
                subtitle: string;
            };
            results: {
                title: string;
                noResults: string;
                tryDifferentSearch: string;
                loadingFlights: string;
                flightsFound: string;
                airline: string;
                departure: string;
                arrival: string;
                duration: string;
                stops: string;
                price: string;
                action: string;
                bookNow: string;
                direct: string;
                oneStop: string;
                multipleStops: string;
            };
            search: {
                title: string;
                origin: string;
                originPlaceholder: string;
                destination: string;
                destinationPlaceholder: string;
                selectDate: string;
                passenger: string;
                passengersPlural: string;
                clear: string;
                departure: string;
                departurePlaceholder: string;
                arrival: string;
                arrivalPlaceholder: string;
                departureDate: string;
                returnDate: string;
                passengers: string;
                button: string;
                searching: string;
                roundTrip: string;
                oneWay: string;
            };
        };
        readonly voos: {
            hero: {
                titulo: string;
                subtitulo: string;
                cta: string;
            };
            pesquisa: {
                idaeVolta: string;
                soIda: string;
                tipoLabel: string;
                de: string;
                para: string;
                partida: string;
                regresso: string;
                passageirosLabel: string;
                passageiro_one: string;
                passageiro_other: string;
                procurar: string;
                aProcurar: string;
                incluirAeroportos: string;
                apenasDiretos: string;
                incluirHotel: string;
                selecionarOrigem: string;
                selecionarDestino: string;
            };
            caracteristicas: {
                titulo: string;
                subtitulo: string;
                badgeDestaque: string;
                coberturaGlobal: string;
                coberturaGlobalDesc: string;
                reservaSegura: string;
                reservaSeguraDesc: string;
                pagamentosFlexiveis: string;
                pagamentosFlexiveisDesc: string;
                suporte24h: string;
                suporte24hDesc: string;
                confortoBordo: string;
                confortoBordoDesc: string;
                bagagemGenerosa: string;
                bagagemGenerosaDesc: string;
                programaFidelidade: string;
                programaFidelidadeDesc: string;
                melhoresPrecos: string;
                melhoresPrecosDesc: string;
                saibaMais: string;
                pronto: string;
                botaoBuscar: string;
            };
            faq: {
                titulo: string;
                subtitulo: string;
                pergunta1: string;
                resposta1: string;
                pergunta2: string;
                resposta2: string;
                pergunta3: string;
                resposta3: string;
                pergunta4: string;
                resposta4: string;
            };
            resultados: {
                titulo: string;
                aeroportosProximos: string;
                apenasDiretos: string;
                direto: string;
                paragens: string;
                nenhumVoo: string;
                tentarNovamente: string;
                erroDuffel: string;
                classeEconomica: string;
                origem: string;
                destino: string;
                duracao: string;
                preco: string;
                porPassageiro: string;
                classificacao: string;
                selecionado: string;
                selecionar: string;
                opcoesHotel: string;
                aProcurarHoteis: string;
                nenhumHotel: string;
                reservarHotel: string;
                avaliacoes: string;
                porNoite: string;
                airlineFallback: string;
            };
            reserva: {
                confirmarTitulo: string;
                fechar: string;
                classeEconomica: string;
                origem: string;
                destino: string;
                duracao: string;
                passageirosLabel: string;
                passageiro_one: string;
                passageiro_other: string;
                tipoViagem: string;
                idaeVolta: string;
                sóIda: string;
                caracteristicas: string;
                precoTotal: string;
                cancelar: string;
                confirmar: string;
                aConfirmar: string;
            };
            page: {
                badge: string;
                benefits: {
                    secureBooking: string;
                    fastComparison: string;
                    dedicatedSupport: string;
                };
                searchShell: {
                    eyebrow: string;
                    title: string;
                    description: string;
                };
                openMaps: {
                    title: string;
                    description: string;
                };
            };
            duffel: {
                title: string;
                subtitle: string;
                searchResults: string;
                flightCardTitle: string;
                airlineFallback: string;
                totalPrice: string;
                directFlight: string;
                flightWithStops: string;
                aircraft: string;
                flightLabel: string;
                cabinClassSuffix: string;
                noFlightsFound: string;
                loading: string;
                errorTitle: string;
                notAvailable: string;
            };
        };
        readonly footer: {
            allRightsReserved: string;
            byTravelers: string;
            categories: {
                empresa: string;
                legal: string;
                ajuda: string;
                suporte: string;
                integrações: string;
            };
            company: {
                title: string;
                careers: string;
                press: string;
            };
            complaints: {
                title: string;
                tooltip: string;
                alt: string;
                entity: string;
            };
            cookies: string;
            description: string;
            followOn: string;
            guest: {
                title: string;
                smartForm: string;
                howItWorks: string;
            };
            ia: {
                preferences: string;
                toggle: string;
            };
            legalTitle: string;
            madeWith: string;
            newsletter: {
                title: string;
                description: string;
            };
            newsletterDescription: string;
            newsletterPlaceholder: string;
            newsletterPrivacy: string;
            newsletterSuccess: string;
            newsletterTitle: string;
            partnersDisclaimer: string;
            partnersTitle: string;
            partnerships: {
                title: string;
                gea: string;
                sanjotec: string;
                dg: string;
                turismodeportugal: string;
            };
            paymentMethods: string;
            paymentMethodsData: {
                transfer: string;
            };
            paymentMethodsTitle: string;
            privacy: string;
            product: {
                title: string;
                features: string;
                pricing: string;
                integrations: string;
                api: string;
                mobile: string;
            };
            quickLinksTitle: string;
            rightsReserved: string;
            securePayments: string;
            resources: {
                title: string;
            };
            services: {
                packages: string;
                hotels: string;
                flights: string;
                transfers: string;
                insurance: string;
            };
            servicesTitle: string;
            support: {
                title: string;
                help: string;
                documentation: string;
                status: string;
                community: string;
                technical: string;
                partnerships: string;
                howItWorks: string;
                integrations: string;
                app: string;
            };
            terms: string;
            user: {
                title: string;
                preferences: string;
                accountSettings: string;
                bookingHistory: string;
            };
            verifiedProvider: string;
            blogTitle: string;
        };
        readonly gallery: {
            cta_button: string;
            cta_description: string;
            cta_title: string;
            error_loading: string;
            items_shown: string;
            no_images_found: string;
            subtitle: string;
            title: string;
            viewItemAria: string;
        };
        readonly help: {
            documentation: string;
            actions: {
                helpful: string;
                yes: string;
                no: string;
                feedback: string;
                print: string;
                share: string;
            };
            hero: {
                title: string;
                subtitle: string;
            };
            sections: {
                search: {
                    placeholder: string;
                    button: string;
                    noResults: string;
                    tryDifferent: string;
                };
                categories: {
                    title: string;
                    gettingStarted: {
                        title: string;
                        description: string;
                    };
                    booking: {
                        title: string;
                        description: string;
                    };
                    account: {
                        title: string;
                        description: string;
                    };
                    payments: {
                        title: string;
                        description: string;
                    };
                    technical: {
                        title: string;
                        description: string;
                    };
                    policies: {
                        title: string;
                        description: string;
                    };
                };
                faq: {
                    title: string;
                    viewAll: string;
                    questions: {
                        howToBook: {
                            question: string;
                            answer: string;
                        };
                        cancelBooking: {
                            question: string;
                            answer: string;
                        };
                        paymentMethods: {
                            question: string;
                            answer: string;
                        };
                        refundPolicy: {
                            question: string;
                            answer: string;
                        };
                        changeBooking: {
                            question: string;
                            answer: string;
                        };
                        support: {
                            question: string;
                            answer: string;
                        };
                    };
                };
                contact: {
                    title: string;
                    description: string;
                    liveChat: string;
                    email: string;
                    phone: string;
                    hours: string;
                };
                tutorials: {
                    title: string;
                    description: string;
                    viewAll: string;
                };
            };
        };
        readonly home: {
            aiFeaturesItems: {
                recommendations: {
                    title: string;
                    desc: string;
                };
                planning: {
                    title: string;
                    desc: string;
                };
                personalization: {
                    title: string;
                    desc: string;
                };
            };
            cta: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                button: string;
                title: string;
                desc: string;
                aiBtn: string;
                aiSub: string;
                placeholder: string;
                btn: string;
                privacy: string;
                stats: {
                    subscribers: string;
                    offers: string;
                    countries: string;
                    satisfaction: string;
                };
            };
            destinations: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
            };
            featuredDestinations: {
                title: string;
                subtitle: string;
                viewAllDestinations: string;
                destinations: {
                    santorini: {
                        name: string;
                        description: string;
                        badge: string;
                        price: string;
                    };
                    tokyo: {
                        name: string;
                        description: string;
                        badge: string;
                        price: string;
                    };
                    bali: {
                        name: string;
                        description: string;
                        badge: string;
                        price: string;
                    };
                };
                reviews: string;
            };
            features: {
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                ctaLabel: string;
                guaranteedSecurity: {
                    title: string;
                    description: string;
                };
                specializedGuides: {
                    title: string;
                    description: string;
                };
                support247: {
                    title: string;
                    description: string;
                };
                bestPrices: {
                    title: string;
                    description: string;
                };
                easyBooking: {
                    title: string;
                    description: string;
                };
                curatedExperiences: {
                    title: string;
                    description: string;
                };
                cruises: {
                    title: string;
                    desc: string;
                    badge: string;
                };
                bus: {
                    title: string;
                    desc: string;
                    badge: null;
                };
                beach: {
                    title: string;
                    desc: string;
                    badge: null;
                };
                badge: {
                    popular: string;
                };
            };
            featuresAI: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                items: {
                    recommendations: {
                        title: string;
                        desc: string;
                    };
                    quickPlanning: {
                        title: string;
                        desc: string;
                    };
                    personalization: {
                        title: string;
                        desc: string;
                    };
                };
            };
            hero: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                ctaMain: string;
                ctaSecondary: string;
                exploreDestinations: string;
                learnMore: string;
            };
            heroAI: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                ctaStart: string;
                ctaDemo: string;
                loading: string;
                preparingDemo: string;
                stats: string[];
            };
            home: string;
            recommendations: {
                title: string;
                subtitle: string;
            };
            stats: {
                satisfiedClients: string;
                exclusiveDestinations: string;
                satisfactionRate: string;
                supportAvailable: string;
                destinations: string;
                partners: string;
                experience: string;
                customers: string;
            };
            statsLabels: {
                destinations: string;
                travelers: string;
                rating: string;
                support: string;
            };
            testimonials: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                ratingLabel: string;
            };
            testimonialsItems: {
                name: string;
                location: string;
                text: string;
            }[];
        };
        readonly hotels: {
            accommodationTypes: {
                title: string;
                description: string;
                learnMore: string;
                types: {
                    hotels: {
                        title: string;
                        description: string;
                        feature1: string;
                        feature2: string;
                    };
                    resorts: {
                        title: string;
                        description: string;
                        feature1: string;
                        feature2: string;
                    };
                    apartments: {
                        title: string;
                        description: string;
                        feature1: string;
                        feature2: string;
                    };
                    boutique: {
                        title: string;
                        description: string;
                        feature1: string;
                        feature2: string;
                    };
                };
            };
            bookingCta: {
                title: string;
                description: string;
                cta: string;
            };
            hero: {
                title: string;
                subtitle: string;
                cta: string;
            };
            destinations: {
                lisbon: string;
                porto: string;
                algarve: string;
                madrid: string;
            };
            popularDestinations: {
                title: string;
                subtitle: string;
                viewHotels: string;
                explore: string;
                error: string;
            };
            ratings: {
                wonderful: string;
                veryGood: string;
                good: string;
                pleasant: string;
                average: string;
            };
            filters: {
                title: string;
                freeCancellation: string;
                payAtProperty: string;
                mealPlans: string;
                propertyType: string;
                sortBy: string;
                starRating: string;
                wonderful: string;
                veryGood: string;
                good: string;
                pleasant: string;
                clear: string;
                apply: string;
                activeFilters: string;
                noActiveFilters: string;
            };
            openMaps: {
                title: string;
                description: string;
            };
            search: {
                results: string;
                searching: string;
                hotelsFound: string;
                placeholder: string;
                tryAgain: string;
            };
            seo: {
                title: string;
                titleWithDestination: string;
                siteName: string;
                description: string;
                descriptionWithDestination: string;
            };
        };
        readonly insurance: {
            benefits: {
                badge: string;
                title: string;
                subtitle: string;
                learnMore: string;
                medical: {
                    title: string;
                    description: string;
                };
                cancellation: {
                    title: string;
                    description: string;
                };
                baggage: {
                    title: string;
                    description: string;
                };
                "247support": string;
                simpleProcess: string;
                priorityAssistance: string;
                specializedAssistance: string;
            };
            benefitsTitle: string;
            contact: {
                badge: string;
                title: string;
                subtitle: string;
            };
            contactCta: {
                title: string;
                description: string;
                cta: string;
            };
            coverage: {
                badge: string;
                title: string;
                subtitle: string;
                selectPlan: string;
            };
            coveragesTitle: string;
            detailedCoverages: string;
            faq: {
                title: string;
                subtitle: string;
                q1: string;
                a1: string;
                q2: string;
                a2: string;
                q3: string;
                a3: string;
            };
            features: {
                medicalExpenses: string;
                personalAccidents: string;
                luggageLoss: string;
                flightCancellation: string;
                tripInterruption: string;
                personalLiability: string;
                extremeSports: string;
                searchAndRescue: string;
                childCareAssistance: string;
                familyPackageDiscounts: string;
            };
            finePrint: string;
            generalBenefits: string;
            getQuoteButton: string;
            hero: {
                title: string;
                subtitle: string;
                cta: string;
            };
            products: {
                title: string;
                subtitle: string;
                basic: {
                    name: string;
                    description: string;
                    summary: string;
                    price: string;
                    finePrint: string;
                };
                premium: {
                    name: string;
                    description: string;
                    summary: string;
                    price: string;
                    badge: string;
                    finePrint: string;
                };
                adventure: {
                    name: string;
                    description: string;
                    summary: string;
                    price: string;
                    finePrint: string;
                };
                family: {
                    name: string;
                    description: string;
                    summary: string;
                    price: string;
                    finePrint: string;
                };
            };
            viewDetails: string;
            whyChooseUs: {
                title: string;
                subtitle: string;
                badge: string;
                feature1_title: string;
                feature1_desc: string;
                feature2_title: string;
                feature2_desc: string;
                feature3_title: string;
                feature3_desc: string;
            };
        };
        readonly language: {
            current: string;
            select: string;
        };
        readonly legal: {
            terms: string;
            privacy: string;
            cookies: string;
            gdpr: string;
            cancellation: string;
            cancellationPage: {
                hero: {
                    title: string;
                    subtitle: string;
                };
                sectionPolicy: {
                    title: string;
                    intro: string;
                    sections: ({
                        title: string;
                        points: string[];
                        periods?: undefined;
                    } | {
                        title: string;
                        points: string[];
                        periods: {
                            period: string;
                            fee: string;
                        }[];
                    })[];
                    important: {
                        title: string;
                        description: string;
                    };
                };
                sectionHowTo: {
                    title: string;
                    steps: {
                        title: string;
                        description: string;
                        icon: string;
                    }[];
                };
                sectionFaq: {
                    title: string;
                    questions: {
                        q: string;
                        a: string;
                    }[];
                };
                needHelp: {
                    title: string;
                    description: string;
                };
                contactSupport: {
                    title: string;
                    description: string;
                    button: string;
                };
                myBookings: {
                    title: string;
                    description: string;
                    button: string;
                };
                ui: {
                    loading: string;
                    refundTimeline: {
                        title: string;
                        description: string;
                    };
                    howToHint: string;
                };
            };
            cookiesPage: {
                title: string;
                lastUpdated: string;
                ui: {
                    readingProgressAria: string;
                    privacyCenterBadge: string;
                    aboutThisPolicy: string;
                };
                sections: {
                    whatAreCookies: {
                        title: string;
                        content: {
                            type: string;
                            text: string;
                        }[];
                    };
                    whyWeUseCookies: {
                        title: string;
                        content: ({
                            type: string;
                            text: string;
                            items?: undefined;
                        } | {
                            type: string;
                            items: string[];
                            text?: undefined;
                        })[];
                    };
                    typesOfCookies: {
                        title: string;
                        content: ({
                            type: string;
                            text: string;
                            description?: undefined;
                            items?: undefined;
                        } | {
                            type: string;
                            text: string;
                            description: string;
                            items: string[];
                        })[];
                    };
                    manageCookies: {
                        title: string;
                        content: {
                            type: string;
                            text: string;
                        }[];
                    };
                };
            };
            gdprPage: {
                hero: {
                    title: string;
                    subtitle: string;
                };
                lastUpdated: string;
                ui: {
                    compliantBadge: string;
                    lastUpdated: string;
                    navigationTitle: string;
                    quickActionsTitle: string;
                    contactDpo: string;
                    exerciseRights: string;
                    nav: {
                        introduction: string;
                        dataCategories: string;
                        dataController: string;
                        dataProcessing: string;
                        dataTypes: string;
                        userRights: string;
                        dataSecurity: string;
                        contact: string;
                    };
                };
                intro: string;
                sections: {
                    dataController: {
                        title: string;
                        content: string;
                        contact: {
                            name: string;
                            email: string;
                            phone: string;
                            address: string;
                        };
                    };
                    dataProcessing: {
                        title: string;
                        purposes: {
                            title: string;
                            description: string;
                            legalBasis: string;
                        }[];
                    };
                    rights: {
                        title: string;
                        description: string;
                        list: {
                            title: string;
                            description: string;
                        }[];
                    };
                    dataSecurity: {
                        title: string;
                        content: string;
                    };
                    dataTransfer: {
                        title: string;
                        content: string;
                    };
                    retention: {
                        title: string;
                        content: string;
                    };
                    complaints: {
                        title: string;
                        content: string;
                    };
                };
            };
            hero: {
                title: string;
                lastUpdated: string;
                terms: string;
                privacy: string;
                cookies: string;
                cancellation: string;
            };
            privacyPage: {
                ui: {
                    badge: string;
                    updatedLabel: string;
                    applicableLabel: string;
                    printVersion: {
                        title: string;
                        description: string;
                        download: string;
                    };
                    intro: string;
                    contactDpo: string;
                    backToTopAria: string;
                };
                title: string;
                introduction: {
                    title: string;
                    content: string[];
                };
                sections: {
                    title: string;
                    content: string[];
                }[];
            };
            sections: string;
            termsPage: {
                title: string;
                introduction: {
                    title: string;
                    content: string[];
                };
                sections: {
                    title: string;
                    content: string[];
                }[];
            };
            title: string;
        };
        readonly loading: {
            loading: {
                admin: string;
                user: string;
                default: string;
                publicPage: string;
                adminDashboard: string;
                userDashboard: string;
                auth: string;
            };
        };
        readonly localGuides: {
            becomeGuide: {
                title: string;
                description: string;
                applyNow: string;
                feature1: {
                    title: string;
                    desc: string;
                };
                feature2: {
                    title: string;
                    desc: string;
                };
                feature3: {
                    title: string;
                    desc: string;
                };
            };
            detailsPanel: {
                about: string;
                tours: string;
                moreInfo: string;
                memberSince: string;
                bookTour: string;
                noTours: string;
                languages: string;
                specialties: string;
                experienceYears: string;
                certifications: string;
                basePrice: string;
                hour: string;
                contactGuideCta: string;
            };
            filters: {
                title: string;
                clear: string;
                searchLabel: string;
                searchPlaceholder: string;
                locationLabel: string;
                allLocations: string;
                specialtyLabel: string;
                allSpecialties: string;
                languageLabel: string;
                allLanguages: string;
            };
            guides: {
                guide_1: {
                    bio: string;
                    tagline: string;
                    tour_title: string;
                    tour_desc: string;
                };
                guide_2: {
                    bio: string;
                    tagline: string;
                    tour_title: string;
                    tour_desc: string;
                };
            };
            guidesList: {
                title: string;
                sortBy: string;
                sortOptions: {
                    rating: string;
                    name: string;
                    experience: string;
                    price: string;
                };
                verified: string;
                reviews_one: string;
                reviews_other: string;
                experience_one: string;
                experience_other: string;
                viewProfile: string;
                noResultsTitle: string;
                noResultsDesc: string;
            };
            hero: {
                badge: string;
                title: string;
                subtitle: string;
            };
            specialties: {
                historia: string;
                gastronomia: string;
                naturaleza: string;
                arquitectura: string;
            };
            page: {
                titlePrefix: string;
                titleHighlight: string;
                loadingExperts: string;
                guidesAvailable: string;
                emptyState: {
                    title: string;
                    description: string;
                    clearAll: string;
                };
                cta: {
                    title: string;
                    subtitle: string;
                    primary: string;
                    secondary: string;
                };
            };
        };
        readonly mobile: {
            app: {
                app: string;
            };
            cta: {
                title: string;
                subtitle: string;
                ios: string;
                android: string;
            };
            features: {
                title: string;
                subtitle: string;
                offlineMaps: {
                    title: string;
                    desc: string;
                };
                pushNotifications: {
                    title: string;
                    desc: string;
                };
                offlineSync: {
                    title: string;
                    desc: string;
                };
                cameraIntegration: {
                    title: string;
                    desc: string;
                };
                gpsNavigation: {
                    title: string;
                    desc: string;
                };
                secureStorage: {
                    title: string;
                    desc: string;
                };
            };
            hero: {
                appLabel: string;
                appStore: string;
                googlePlay: string;
            };
            reviews: {
                title: string;
                subtitle: string;
                maria: {
                    comment: string;
                };
                joao: {
                    comment: string;
                };
                ana: {
                    comment: string;
                };
            };
            screenshots: {
                title: string;
                subtitle: string;
                explore: {
                    title: string;
                    desc: string;
                };
                plan: {
                    title: string;
                    desc: string;
                };
                book: {
                    title: string;
                    desc: string;
                };
            };
            stats: {
                downloads: string;
                rating: string;
                activeUsers: string;
                countries: string;
            };
        };
        readonly nav: {
            about: string;
            accessibility: {
                skipToContent: string;
                contrast: string;
                fontSize: string;
            };
            activities: string;
            auth: {
                login: string;
                register: string;
            };
            blog: string;
            blogMenu: {
                allPosts: string;
                sustainableTravel: string;
            };
            booking: string;
            common: {
                toggleMenu: string;
                logout: string;
            };
            community: string;
            contact: string;
            cruzeiros: string;
            cruises: string;
            currency: {
                eur: string;
                usd: string;
                gbp: string;
            };
            demo: string;
            destinations: string;
            faq: string;
            flights: string;
            gallery: string;
            goToHome: string;
            home: string;
            hotels: string;
            integrations: string;
            language: {
                en: string;
                es: string;
                pt: string;
                fr: string;
                label: string;
            };
            legal: {
                terms: string;
                privacy: string;
                cookies: string;
                accessibility: string;
            };
            login: string;
            map: string;
            menu: string;
            mobileNavigation: string;
            bottom_nav: string;
            dashboard: string;
            trips: string;
            bookings: string;
            profile: string;
            searchPlaceholder: string;
            quickActions: string;
            newTrip: string;
            newBooking: string;
            support: string;
            notifications: string;
            newBookingConfirmed: string;
            bookingConfirmedForLisbon: string;
            myProfile: string;
            settings: string;
            billing: string;
            help: string;
            search: string;
            account: string;
            openMenu: string;
            packages: string;
            planYourTrip: string;
            poweredByAI: string;
            preferences: string;
            register: string;
            rent_a_car: string;
            services: string;
            servicesList: {
                packages: string;
                hotels: string;
                flights: string;
                transfers: string;
                cruises: string;
                localGuides: string;
                insurance: string;
                all: string;
                ferries: string;
                trains: string;
                rent_a_car: string;
                buses: string;
                activities: string;
            };
            smartForm: string;
            sustainable: string;
            user: {
                profile: string;
                trips: string;
                wishlist: string;
                settings: string;
            };
            userMenu: {
                profile: string;
                settings: string;
                dashboard: string;
                logout: string;
                billing: string;
                help: string;
            };
            userNavigation: {
                dashboard: string;
                trips: string;
                bookings: string;
                profile: string;
                payments: string;
                settings: string;
            };
        };
        readonly newsletter: {
            newsletter: {
                description: string;
                emailLabel: string;
                emailPlaceholder: string;
                subscribeButton: string;
                title: string;
            };
            title: string;
            description: string;
            emailPlaceholder: string;
            subscribeButton: string;
        };
        readonly notifications: {
            empty: string;
            error: string;
            info: string;
            markAll: string;
            success: string;
            title: string;
            toggle: string;
            unread: string;
            urgent: string;
            viewAll: string;
            warning: string;
        };
        readonly packages: {
            customCta: {
                title: string;
                description: string;
                cta: string;
            };
            hero: {
                title: string;
                subtitle: string;
                cta: string;
                viewDeals: string;
            };
            packageTypes: {
                title: string;
                description: string;
                explore: string;
                romantic: {
                    title: string;
                    description: string;
                    feature1: string;
                    feature2: string;
                };
                family: {
                    title: string;
                    description: string;
                    feature1: string;
                    feature2: string;
                };
                adventure: {
                    title: string;
                    description: string;
                    feature1: string;
                    feature2: string;
                };
                gastronomic: {
                    title: string;
                    description: string;
                    feature1: string;
                    feature2: string;
                };
                luxury: {
                    title: string;
                    description: string;
                };
                wellness: {
                    title: string;
                    description: string;
                };
                "group-travel": {
                    title: string;
                    description: string;
                };
                "cultural-exchange": {
                    title: string;
                    description: string;
                };
                "photography-tourism": {
                    title: string;
                    description: string;
                };
                "snow-sports": {
                    title: string;
                    description: string;
                };
                "corporate-travel": {
                    title: string;
                    description: string;
                };
                "coastal-tourism": {
                    title: string;
                    description: string;
                };
            };
            personalized: {
                title: string;
                description: string;
                learnMore: string;
            };
            featuredPackages: {
                title: string;
            };
            page: {
                hero: {
                    title: string;
                    subtitle: string;
                };
                error: {
                    title: string;
                    message: string;
                    retry: string;
                };
                empty: {
                    title: string;
                    message: string;
                };
                unknown: string;
                onRequest: string;
                brand: string;
                featured: string;
                categoryBanner: {
                    title: string;
                    subtitle: string;
                    cta: string;
                };
                stats: {
                    packages: string;
                    destinations: string;
                    categories: string;
                    averageRating: string;
                    na: string;
                };
                schema: {
                    collectionName: string;
                    collectionDescription: string;
                    breadcrumbHome: string;
                    breadcrumbPackages: string;
                    organizationName: string;
                    organizationDescription: string;
                };
            };
        };
        readonly payments: {
            actions: {
                menu: string;
                options: string;
                configure: string;
                viewProvider: string;
                activate: string;
                deactivate: string;
                delete: string;
                clickToActivate: string;
                clickToDeactivate: string;
            };
            addMethod: string;
            currency: {
                free: string;
            };
            description: string;
            dialog: {
                addTitle: string;
                editTitle: string;
                addDescription: string;
                editDescription: string;
                fields: {
                    methodName: string;
                    methodNamePlaceholder: string;
                    provider: string;
                    providerPlaceholder: string;
                    feesDescription: string;
                    feesPlaceholder: string;
                    activeMethod: string;
                };
                buttons: {
                    cancel: string;
                    saving: string;
                    saveChanges: string;
                    addMethod: string;
                };
            };
            messages: {
                methodsLoaded: string;
                loadError: string;
                loadErrorDescription: string;
                validationError: string;
                nameRequired: string;
                updateSuccess: string;
                methodUpdated: string;
                methodAdded: string;
                saveError: string;
                saveErrorDescription: string;
                statusUpdated: string;
                statusUpdateError: string;
                deleteConfirm: string;
                methodDeleted: string;
                deleteError: string;
            };
            stats: {
                activeMethods: string;
                activeMethodsDescription: string;
                averageFee: string;
                averageFeeDescription: string;
                mostPopular: string;
                mostPopularValue: string;
                mostPopularDescription: string;
                nextReview: string;
                nextReviewValue: string;
                nextReviewDescription: string;
            };
            status: {
                ativo: string;
                inativo: string;
                em_configuracao: string;
            };
            table: {
                title: string;
                description: string;
                searchPlaceholder: string;
                tabs: {
                    all: string;
                    active: string;
                    inactive: string;
                };
                headers: {
                    name: string;
                    provider: string;
                    status: string;
                    fees: string;
                    availableIn: string;
                    lastUpdated: string;
                    actions: string;
                };
                noMethods: string;
                global: string;
            };
            title: string;
        };
        readonly preferences: {
            activities: {
                beaches: string;
                adventure: string;
                culture: string;
                gastronomy: string;
                nightlife: string;
                nature: string;
                photography: string;
                shopping: string;
                wellness: string;
            };
            budget: string;
            budgetOptions: {
                select: string;
                "500-1000": string;
                "1000-3000": string;
                "3000-5000": string;
                "5000+": string;
            };
            comments: string;
            departureDate: string;
            destination: string;
            destinations: {
                europe: string;
                asia: string;
                northAmerica: string;
                southAmerica: string;
                africa: string;
                oceania: string;
                caribbean: string;
                middleEast: string;
            };
            duration: string;
            durationOptions: {
                select: string;
                weekend: string;
                week: string;
                "2weeks": string;
                month: string;
            };
            email: string;
            errorGeneratingTrip: string;
            errorSavingFeedback: string;
            feedbackSaved: string;
            generateTrip: string;
            generating: string;
            interests: string;
            interestsEnum: {
                ADVENTURE: string;
                CULTURE: string;
                RELAXATION: string;
                NATURE: string;
                GASTRONOMY: string;
            };
            itinerary: string;
            name: string;
            nextMonth: string;
            nextQuarter: string;
            nextWeek: string;
            placeholders: {
                groupSize: string;
                dietary: string;
                specialRequests: string;
            };
            planningSection: string;
            provideFeedback: string;
            quickSelection: string;
            rating: string;
            returnDate: string;
            selectDepartureDate: string;
            selectInterest: string;
            selectReturnDate: string;
            selectSustainability: string;
            submit: string;
            submitFeedback: string;
            submitting: string;
            subtitle: string;
            success: string;
            successDescription: string;
            sustainability: string;
            sustainabilityEnum: {
                LOW: string;
                MEDIUM: string;
                HIGH: string;
            };
            title: string;
            travelDates: string;
            travelStyles: {
                luxury: string;
                adventure: string;
                budget: string;
            };
            travelers: string;
            tripGenerated: string;
            validation: {
                nameRequired: string;
                emailInvalid: string;
                budgetPositive: string;
                durationPositive: string;
                travelersMin: string;
            };
            yourTripProposal: string;
        };
        readonly press: {
            awards: {
                title: string;
                noAwards: string;
            };
            hero: {
                title: string;
                subtitle: string;
            };
            resources: {
                title: string;
                brandGuidelines: string;
                logos: string;
                screenshots: string;
                videos: string;
                presentations: string;
            };
            sections: {
                about: {
                    title: string;
                    description: string;
                };
                newsReleases: {
                    title: string;
                    noReleases: string;
                    viewAll: string;
                };
                mediaKit: {
                    title: string;
                    description: string;
                    downloadButton: string;
                };
                contact: {
                    title: string;
                    description: string;
                    email: string;
                    phone: string;
                    contactButton: string;
                };
                facts: {
                    title: string;
                    founded: string;
                    headquarters: string;
                    employees: string;
                    users: string;
                    countries: string;
                };
                leadership: {
                    title: string;
                    ceo: string;
                    cto: string;
                    cmo: string;
                };
            };
            timeline: {
                title: string;
                milestones: string;
            };
        };
        readonly pricing: {
            billing: {
                monthly: string;
                annually: string;
                toggleAriaLabel: string;
                defaultSave: string;
                perYearShort: string;
                perMonthShort: string;
            };
            choosePlan: {
                title: string;
                description: string;
            };
            faq: {
                title: string;
                description: string;
                q1: {
                    title: string;
                    description: string;
                };
                q2: {
                    title: string;
                    description: string;
                };
                q3: {
                    title: string;
                    description: string;
                };
                q4: {
                    title: string;
                    description: string;
                };
                q5: {
                    title: string;
                    description: string;
                    linkText: string;
                };
            };
            free: string;
            hero: {
                title: string;
                subtitle: string;
            };
            plans: {
                mostPopular: string;
                popularBadge: string;
                bonusFeature: string;
                basic: {
                    name: string;
                    description: string;
                    cta: string;
                    feature1: string;
                    feature2: string;
                    feature3: string;
                    feature4: string;
                    feature4Tooltip: string;
                };
                premium: {
                    name: string;
                    description: string;
                    cta: string;
                    annualSave: string;
                    feature1: string;
                    feature2: string;
                    feature3: string;
                    feature3Tooltip: string;
                    feature4: string;
                    feature5: string;
                    feature6: string;
                };
                business: {
                    name: string;
                    description: string;
                    cta: string;
                    priceSuffix: string;
                    annualSave: string;
                    feature1: string;
                    feature2: string;
                    feature3: string;
                    feature4: string;
                    feature5: string;
                    feature5Tooltip: string;
                    feature6: string;
                    feature7: string;
                };
            };
        };
        readonly profile: {
            account: {
                title: string;
                delete_account: string;
                delete_confirm: string;
                account_deleted: string;
            };
            address: {
                title: string;
                description: string;
                street: string;
                number: string;
                complement: string;
                neighborhood: string;
                city: string;
                state: string;
                postal_code: string;
                country: string;
            };
            admin: {
                dashboard: string;
                users: string;
                settings: {
                    title: string;
                };
                blog: string;
                sustainable_travel: string;
            };
            complete: string;
            completeness: string;
            contact: string;
            data_sharing: {
                title: string;
                share_with_partners: string;
                share_with_partners_description: string;
            };
            description: string;
            edit: string;
            info_updated: string;
            logout: string;
            notifications: {
                title: string;
                marketing_emails: string;
                marketing_emails_description: string;
                sms_notifications: string;
                sms_notifications_description: string;
                push_notifications: string;
                push_notifications_description: string;
            };
            payment: string;
            payment_methods: {
                title: string;
                description: string;
                no_payment_methods: string;
                add_payment_method: string;
                add_payment_method_button: string;
            };
            personal: string;
            personal_data: {
                title: string;
                description: string;
                first_name: string;
                last_name: string;
                email: string;
                phone: string;
                date_of_birth: string;
                nationality: string;
                tax_id: string;
                gender: string;
                gender_female: string;
                gender_male: string;
                marital_status: string;
                marital_status_married: string;
                marital_status_single: string;
            };
            preferences: string;
            privacy: string;
            privacy_settings: {
                title: string;
                description: string;
                profile_visibility: string;
                show_email: string;
                show_email_description: string;
                show_phone: string;
                show_phone_description: string;
                show_address: string;
                show_address_description: string;
            };
            save_changes: string;
            security: {
                title: string;
                current_password: string;
                new_password: string;
                confirm_new_password: string;
                change_password: string;
                passwords_dont_match: string;
                password_updated: string;
                invalid_password: string;
            };
            title: string;
            travel_preferences: {
                title: string;
                description: string;
                preferred_currency: string;
                euro: string;
                us_dollar: string;
                british_pound: string;
                brazilian_real: string;
                preferred_language: string;
                portuguese: string;
                english: string;
                spanish: string;
                french: string;
            };
            unexpected_error: string;
            verification: {
                email_verified: string;
                phone_not_verified: string;
            };
        };
        readonly profilepreferences: {
            budget: string;
            duration: string;
            group_size: string;
            payment_methods: string;
            preferred_currency: string;
            preferred_language: string;
            select_budget: string;
            select_duration: string;
            select_payment_method: string;
            title: string;
            travel_preferences: string;
        };
        readonly register: {
            account_created_success: string;
            already_have_account: string;
            confirm_password: string;
            confirm_your_password: string;
            continue_with_facebook: string;
            continue_with_google: string;
            create_account: string;
            create_account_button: string;
            create_password: string;
            creating_account: string;
            email: string;
            error_creating_account: string;
            fill_required_fields: string;
            first_name: string;
            form: {
                accept_terms: string;
                accept_privacy: string;
                accept_cookies: string;
                newsletter: string;
                terms_of_service: string;
                privacy_policy: string;
                cookie_policy: string;
            };
            last_name: string;
            login_link: string;
            medium: string;
            or: string;
            password: string;
            password_strength: string;
            passwords_dont_match: string;
            phone: string;
            required_field: string;
            strong: string;
            subtitle: string;
            title: string;
            unexpected_error: string;
            weak: string;
        };
        readonly rentacar: {
            action: string;
            any: string;
            availableCars: string;
            availableNow: string;
            bookNow: string;
            carType: string;
            carsFound: string;
            contactInfo: string;
            contactSupport: string;
            endDate: string;
            feature1: string;
            feature2: string;
            feature3: string;
            image: string;
            location: string;
            locations: string;
            maxPrice: string;
            model: string;
            needHelp: string;
            price: string;
            pricePerDay: string;
            quickStats: string;
            search: string;
            searchAndBook: string;
            searchModel: string;
            searchPlaceholder: string;
            startDate: string;
            subtitle: string;
            titlePart1: string;
            titlePart2: string;
            totalCars: string;
            totalPrice: string;
            whyChooseUs: string;
        };
        readonly search: {
            filters: {
                title: string;
                clear: string;
                type: {
                    title: string;
                    destinations: string;
                    hotels: string;
                    packages: string;
                    attractions: string;
                    restaurants: string;
                };
                price: {
                    title: string;
                };
                rating: {
                    title: string;
                    any: string;
                };
            };
            header: {
                exploreOffers: string;
            };
            results: {
                count: string;
                featured: string;
                types: {
                    destination: string;
                    transfer: string;
                    restaurant: string;
                    cruise: string;
                    attraction: string;
                    package: string;
                    hotel: string;
                    flight: string;
                };
                reviews: string;
                noReviews: string;
                perWhat: {
                    vehicle: string;
                    experience: string;
                    guest: string;
                    person: string;
                    night: string;
                };
                viewDetails: string;
            };
            sort: {
                placeholder: string;
                relevance: string;
                priceLow: string;
                priceHigh: string;
                ratingHigh: string;
                nameAZ: string;
            };
            view: {
                list: string;
                map: string;
            };
        };
        readonly services: {
            benefits: {
                title: string;
                subtitle: string;
                items: string[];
            };
            cta: {
                title: string;
                subtitle: string;
                buttons: {
                    quote: string;
                    destinations: string;
                };
            };
            hero: {
                badge: string;
                title: string;
                subtitle: string;
            };
            mainServices: {
                title: string;
                subtitle: string;
                popularBadge: string;
                ctaButton: string;
                items: {
                    packages: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    flights: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    hotels: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    transfers: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    cruises: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    localGuides: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    insurance: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                };
            };
            process: {
                title: string;
                subtitle: string;
                items: {
                    step1: {
                        title: string;
                        description: string;
                    };
                    step2: {
                        title: string;
                        description: string;
                    };
                    step3: {
                        title: string;
                        description: string;
                    };
                    step4: {
                        title: string;
                        description: string;
                    };
                };
            };
            specializedServices: {
                title: string;
                subtitle: string;
                ctaButton: string;
                items: {
                    honeymoon: {
                        title: string;
                        description: string;
                    };
                    groupTravel: {
                        title: string;
                        description: string;
                    };
                    culturalExchange: {
                        title: string;
                        description: string;
                    };
                    photoTourism: {
                        title: string;
                        description: string;
                    };
                };
            };
        };
        readonly settings: {
            settings: {
                title: string;
                subtitle: string;
                notifications: string;
                notificationsDescription: string;
                disable: string;
                enable: string;
                language: string;
                languageDescription: string;
                dangerZone: string;
                dangerZoneDescription: string;
                deleteAccount: string;
                notificationTypes: {
                    email: string;
                    push: string;
                    sms: string;
                };
                notificationDescriptions: {
                    email: string;
                    push: string;
                    sms: string;
                };
            };
        };
        readonly 'smart-form': {
            basics: {
                header: {
                    title: string;
                    subtitle: string;
                };
                completion: {
                    allDone: string;
                    progress: string;
                };
                aria: {
                    progressBar: string;
                    done: string;
                    pending: string;
                    stepStatus: string;
                };
                groups: {
                    whereWhen: {
                        label: string;
                        description: string;
                    };
                    whoHow: {
                        label: string;
                        description: string;
                    };
                    travelType: {
                        label: string;
                        description: string;
                    };
                };
                sections: {
                    destination: {
                        title: string;
                        subtitle: string;
                    };
                    dates: {
                        title: string;
                        subtitle: string;
                    };
                    travelers: {
                        title: string;
                        subtitle: string;
                    };
                    language: {
                        title: string;
                        subtitle: string;
                    };
                };
            };
            budget: {
                header: {
                    title: string;
                    subtitle: string;
                };
                categories: {
                    accommodation: string;
                    food: string;
                    activities: string;
                    transport: string;
                    shopping: string;
                    emergency: string;
                    travelInsurance: string;
                };
                settings: {
                    title: string;
                    subtitle: string;
                    currency: string;
                    durationDays: string;
                };
                savings: {
                    title: string;
                    subtitle: string;
                    amount: string;
                    progress: string;
                    savedOf: string;
                    total: string;
                };
                tips: {
                    title: string;
                    subtitle: string;
                    emergencyBuffer: {
                        title: string;
                        body: string;
                    };
                    dailySpending: {
                        title: string;
                        body: string;
                        bodyWithSuggestion: string;
                    };
                    savingsStrategy: {
                        title: string;
                        good: string;
                        improve: string;
                    };
                };
                overview: {
                    totalBudget: {
                        label: string;
                        perDay: string;
                    };
                    savingsGoal: {
                        label: string;
                        percentOfTotal: string;
                    };
                    tripDuration: {
                        label: string;
                        value: string;
                        extended: string;
                        short: string;
                    };
                };
                aria: {
                    sidebar: string;
                };
            };
            personalization: {
                title: string;
                description: string;
                banner: {
                    noPreferences: string;
                    noActivities: string;
                    ready: string;
                    count: string;
                };
                sections: {
                    travelPreferences: {
                        title: string;
                        subtitle: string;
                    };
                    activities: {
                        title: string;
                        subtitle: string;
                    };
                };
            };
        };
        readonly support: {
            agents: {
                title: string;
                subtitle: string;
                rating: string;
                responseTime: string;
                specialties: string;
                languages: string;
                startChat: string;
                offline: string;
                online: string;
            };
            articles: {
                title: string;
                subtitle: string;
                readTime: string;
                views: string;
                updated: string;
                readArticle: string;
                difficulty: {
                    beginner: string;
                    intermediate: string;
                    advanced: string;
                };
            };
            channels: {
                title: string;
                subtitle: string;
                liveChat: string;
                email: string;
                phone: string;
                videoCall: string;
                contact: string;
                unavailable: string;
                availability: string;
                responseTime: string;
                languages: string;
            };
            common: {
                loading: string;
                error: string;
                success: string;
                cancel: string;
                save: string;
                close: string;
                back: string;
                next: string;
                previous: string;
            };
            emergency: {
                title: string;
                subtitle: string;
                phone: string;
                emergencyChat: string;
            };
            faq: {
                title: string;
                subtitle: string;
                helpful: string;
                views: string;
                viewMore: string;
                categories: {
                    all: string;
                    bookings: string;
                    api: string;
                    payments: string;
                    account: string;
                    mobile: string;
                    security: string;
                };
            };
            hero: {
                title: string;
                subtitle: string;
            };
            search: {
                placeholder: string;
                noResults: string;
                resultsFound: string;
            };
            stats: {
                avgResponseTime: string;
                satisfactionRate: string;
                articlesAvailable: string;
                supportAgents: string;
            };
            tabs: {
                faq: string;
                articles: string;
                ticket: string;
                agents: string;
            };
            ticket: {
                title: string;
                subtitle: string;
                form: {
                    name: string;
                    email: string;
                    subject: string;
                    category: string;
                    priority: string;
                    description: string;
                    attachments: string;
                    submit: string;
                    submitting: string;
                    selectCategory: string;
                    selectPriority: string;
                    dragFiles: string;
                    maxFiles: string;
                };
                categories: {
                    technical: string;
                    billing: string;
                    account: string;
                    feature: string;
                    other: string;
                };
                priorities: {
                    low: string;
                    medium: string;
                    high: string;
                    urgent: string;
                };
            };
        };
        readonly sustainable: {
            articles: {
                readMore: string;
            };
            page: {
                hero: {
                    title: string;
                    subtitle: string;
                };
                commitment: {
                    title: string;
                    subtitle: string;
                    pillars: {
                        icon: string;
                        title: string;
                        description: string;
                        colorClass: string;
                    }[];
                };
                practices: {
                    title: string;
                    subtitle: string;
                    items: {
                        id: string;
                        icon: string;
                        title: string;
                        description: string;
                        points: string[];
                    }[];
                };
                articles: {
                    title: string;
                    subtitle: string;
                    items: {
                        title: string;
                        excerpt: string;
                        image: string;
                        category: string;
                        date: string;
                        slug: string;
                    }[];
                    readMore: string;
                    cta: string;
                };
                joinMovement: {
                    title: string;
                    description: string;
                    mainCta: string;
                    secondaryCta: string;
                };
                callToAction: string;
            };
        };
        readonly terms: {
            responsibility: {
                title: string;
                subtitle: string;
                lastUpdated: string;
                effectiveDate: string;
                introduction: string;
                sections: {
                    liability: {
                        title: string;
                        intro: string;
                        scope: string;
                        exclusions: string[];
                    };
                    client: {
                        title: string;
                        intro: string;
                        items: string[];
                    };
                    company: {
                        title: string;
                        intro: string;
                        items: string[];
                    };
                    insurance: {
                        title: string;
                        intro: string;
                        coverage: string[];
                        company: string;
                    };
                    disputes: {
                        title: string;
                        intro: string;
                        procedure: string[];
                        jurisdiction: string;
                    };
                };
            };
            error: {
                title: string;
                message: string;
                retry: string;
            };
            terms: {
                lastUpdated: string;
                effective: string;
                version: string;
                download: string;
                print: string;
            };
            footer: {
                newsletter: {
                    title: string;
                    description: string;
                    placeholder: string;
                    success: string;
                    error: string;
                };
                contact: {
                    title: string;
                };
                legal: {
                    title: string;
                };
                compliance: {
                    title: string;
                };
                governed: string;
                questions: string;
                rights: string;
                secure: string;
                verified: string;
                transparent: string;
            };
        };
        readonly testimonials: {
            listTitle: string;
            quotePrefix: string;
            quoteSuffix: string;
            rating: string;
            subtitle: string;
            title: string;
            feedbackLabel: string;
            noReviews: string;
            totalReviews: string;
            averageRating: string;
            verified: string;
            featured: string;
            fallback: {
                comments: string[];
                trips: string[];
            };
        };
        readonly theme: {
            accessibility: {
                themeToggle: string;
                currentTheme: string;
                themeMenu: string;
                closeMenu: string;
            };
            adminDark: string;
            adminLight: string;
            auto: string;
            autoActive: string;
            current: string;
            dark: string;
            interfaceTitle: string;
            light: string;
            moreOptions: string;
            nightSchedule: string;
            settings: {
                title: string;
                description: string;
                autoMode: string;
                autoModeDescription: string;
                manualMode: string;
                manualModeDescription: string;
            };
            simpleMode: string;
            toggleAria: string;
            toggleTitle: string;
            userDark: string;
            userLight: string;
        };
        readonly transfer: {
            bookingForm: {
                title: string;
                description: string;
                from: string;
                from_placeholder: string;
                to: string;
                to_placeholder: string;
                button: string;
            };
            cta: {
                title: string;
                description: string;
                button: string;
            };
            fleet: {
                title: string;
                subtitle: string;
                vehicle: {
                    sedan: string;
                    sedan_desc: string;
                    executive: string;
                    executive_desc: string;
                    van: string;
                    van_desc: string;
                };
            };
            hero: {
                title: string;
                subtitle: string;
            };
            howItWorks: {
                title: string;
                subtitle: string;
                step1_title: string;
                step1_desc: string;
                step2_title: string;
                step2_desc: string;
                step3_title: string;
                step3_desc: string;
            };
        };
        readonly transfers: {
            bookingForm: {
                title: string;
                description: string;
                from: string;
                from_placeholder: string;
                to: string;
                to_placeholder: string;
                button: string;
            };
            cta: {
                title: string;
                description: string;
                button: string;
            };
            fleet: {
                title: string;
                subtitle: string;
                vehicle: {
                    sedan: string;
                    sedan_desc: string;
                    executive: string;
                    executive_desc: string;
                    van: string;
                    van_desc: string;
                };
            };
            hero: {
                title: string;
                subtitle: string;
            };
            howItWorks: {
                title: string;
                subtitle: string;
                step1: {
                    title: string;
                    description: string;
                };
                step2: {
                    title: string;
                    description: string;
                };
                step3: {
                    title: string;
                    description: string;
                };
            };
            toast: {
                noResultsTitle: string;
                description: string;
            };
        };
        readonly 'traveler-profile': {
            profile: {
                title: string;
                completeness: {
                    title: string;
                    complete: string;
                    incomplete: string;
                    progress: string;
                    completeItem: string;
                    items: {
                        profile_photo: string;
                        phone: string;
                        documents: string;
                        emergency_contact: string;
                        ai_preferences: string;
                        travel_preferences: string;
                        payment_methods: string;
                        address: string;
                    };
                };
            };
            documents: {
                title: string;
                subtitle: string;
                add: string;
                addTitle: string;
                addDescription: string;
                noDocuments: string;
                fields: {
                    type: string;
                    number: string;
                    issueDate: string;
                    expiryDate: string;
                    issuer: string;
                };
                types: {
                    passport: string;
                    national_id: string;
                    visa: string;
                    drivers_license: string;
                    travel_pass: string;
                };
                status: {
                    valid: string;
                    expiring_soon: string;
                    expired: string;
                    needs_verification: string;
                };
                verified: string;
                issued: string;
                expires: string;
                expiresIn: string;
                upload: string;
                delete: string;
            };
            emergencyContact: {
                title: string;
                subtitle: string;
                add: string;
                addTitle: string;
                addDescription: string;
                noContacts: string;
                fields: {
                    name: string;
                    relationship: string;
                    phone: string;
                    email: string;
                };
                relationships: {
                    spouse: string;
                    parent: string;
                    sibling: string;
                    child: string;
                    friend: string;
                    other: string;
                };
                primary: string;
                delete: string;
            };
            stats: {
                title: string;
                subtitle: string;
                totalTrips: string;
                countries: string;
                cities: string;
                daysTraveled: string;
                milesTraveled: string;
                reviews: string;
                averageRating: string;
                upcomingTrips_one: string;
                upcomingTrips_other: string;
                favoriteDestination: string;
            };
            badges: {
                title: string;
                earned: string;
                nextBadges: string;
                types: {
                    first_trip: {
                        name: string;
                        description: string;
                    };
                    explorer: {
                        name: string;
                        description: string;
                    };
                    world_traveler: {
                        name: string;
                        description: string;
                    };
                    early_booker: {
                        name: string;
                        description: string;
                    };
                    sustainable_traveler: {
                        name: string;
                        description: string;
                    };
                    reviewer: {
                        name: string;
                        description: string;
                    };
                    loyal_customer: {
                        name: string;
                        description: string;
                    };
                    adventure_seeker: {
                        name: string;
                        description: string;
                    };
                    culture_enthusiast: {
                        name: string;
                        description: string;
                    };
                    beach_lover: {
                        name: string;
                        description: string;
                    };
                    mountain_explorer: {
                        name: string;
                        description: string;
                    };
                    city_hopper: {
                        name: string;
                        description: string;
                    };
                    foodie_traveler: {
                        name: string;
                        description: string;
                    };
                    budget_savvy: {
                        name: string;
                        description: string;
                    };
                    luxury_traveler: {
                        name: string;
                        description: string;
                    };
                };
            };
            tabs: {
                personal: string;
                travel: string;
                preferences: string;
            };
            actions: {
                save: string;
                cancel: string;
                edit: string;
                delete: string;
                add: string;
            };
        };
    };
    readonly fr: {
        readonly about: {
            certifications: {
                title: string;
                subtitle: string;
                verified: string;
                items: {
                    turismoPortugal: {
                        name: string;
                        description: string;
                        type: string;
                    };
                    iata: {
                        name: string;
                        description: string;
                        type: string;
                    };
                    lre: {
                        name: string;
                        description: string;
                        type: string;
                    };
                };
            };
            company: {
                name: string;
                slogan: string;
            };
            coreValues: {
                mainTitle1: string;
                mainTitle2: string;
                mainSubtitle: string;
                personalization: {
                    title: string;
                    desc: string;
                };
                sustainability: {
                    title: string;
                    desc: string;
                };
                ethicsIntegrity: {
                    title: string;
                    desc: string;
                };
                innovation: {
                    title: string;
                    desc: string;
                };
                clientFocus: {
                    title: string;
                    desc: string;
                };
                community: {
                    title: string;
                    desc: string;
                };
            };
            footer: {
                callNow: string;
                backToTop: string;
                cta: {
                    title: string;
                    subtitle: string;
                    contact: string;
                    explore: string;
                };
            };
            founder: {
                bio1: string;
                quote: string;
                badge1: string;
                badge2: string;
                badge3: string;
                title1: string;
                title2: string;
            };
            hero: {
                title1: string;
                title2: string;
                subtitle: string;
                cta: string;
            };
            mapContact: {
                title: string;
                address: string;
                phone: string;
                email: string;
            };
            partnerships: {
                title1: string;
                title2: string;
                subtitle: string;
                gea: {
                    desc: string;
                };
                sanjotec: {
                    desc: string;
                };
                dgconsulting: {
                    desc: string;
                };
                turismodeportugal: {
                    desc: string;
                };
                officialPartner: string;
            };
            stats: {
                satisfiedClients: string;
                exclusiveDestinations: string;
                satisfactionRate: string;
                supportAvailable: string;
            };
            story: {
                title1: string;
                title2: string;
                subtitle: string;
                visionTitle: string;
                paragraph1: string;
                paragraph2: string;
                ourMission: string;
                missionStatement: string;
                imageAlt: string;
                location: string;
            };
            team: {
                title: string;
                subtitle: string;
                luis: {
                    name: string;
                    status: string;
                    bioTitle: string;
                    role: string;
                    bio: string;
                    fullBio: string;
                    curriculum: string[];
                    contact: string;
                    knowMore: string;
                    experience: string;
                    contactMe: string;
                };
            };
            trust: {
                title1: string;
                title2: string;
                subtitle: string;
            };
            newsletter: {
                title: string;
            };
            mobile: {
                app: {
                    app: string;
                };
            };
            help: {
                documentation: string;
            };
            legal: {
                terms: string;
                privacy: string;
                cookies: string;
                gdpr: string;
                cancellation: string;
            };
        };
        readonly activities: {
            activities: {
                title: string;
                subtitle: string;
                searchPlaceholder: string;
                searchButton: string;
                noActivitiesFound: string;
                errorFetching: string;
                viewOnTripAdvisor: string;
            };
        };
        readonly activity: {
            empty: string;
            title: string;
        };
        readonly admin: {
            accessDenied: string;
            actions: string;
            adminRequired: string;
            ai: {
                serviceStatus: {
                    title: string;
                    description: string;
                };
                results: {
                    chatTitle: string;
                    sentTitle: string;
                    priceTitle: string;
                    anomTitle: string;
                    itinTitle: string;
                };
                resultDisplay: {
                    processingTitle: string;
                    processingDesc: string;
                    successTitle: string;
                    errorTitle: string;
                    completionTimeLabel: string;
                    unknownError: string;
                    testingLabel: string;
                };
                history: {
                    title: string;
                    description: string;
                    noItems: string;
                    clearButton: string;
                    item: {
                        service: string;
                        title: string;
                        time: string;
                        duration: string;
                    };
                };
            };
            all: string;
            analytics: {
                title: string;
                subtitle: string;
                noData: string;
                noDataAvailable: string;
                loadingError: string;
                exporting: string;
                format: string;
                exportCSV: string;
                exportPDF: string;
                tabs: {
                    overview: string;
                    traffic: string;
                    conversion: string;
                    destinations: string;
                };
                kpi: {
                    bookings: string;
                    revenue: string;
                    users: string;
                    conversion: string;
                    avgOrder: string;
                    bounceRate: string;
                    perBooking: string;
                };
            };
            app: {
                name: string;
                version: string;
                "Toggle theme": string;
                "More options": string;
            };
            applyFilters: string;
            auth: string;
            backToLogs: string;
            booking: string;
            breadcrumb: {
                home: string;
                admin: string;
            };
            cancel: string;
            category: string;
            breadcrumbs: {
                admin: string;
                users: string;
                analytics: string;
                dashboard: string;
                bookings: string;
                content: string;
                settings: string;
                reports: string;
                system: string;
            };
            clear: string;
            clearFilters: string;
            close: string;
            collapse: string;
            confirmDeleteLog: string;
            confirmDeleteSelected: string;
            copied: string;
            copyToClipboard: string;
            critical: string;
            dashboard: {
                title: string;
                description: string;
                welcome: string;
                crm: string;
                crm_description: string;
                bookings: string;
                bookings_description: string;
                finances: string;
                finances_description: string;
                account: string;
                account_description: string;
                newsletter: string;
                newsletter_description: string;
                destinations: string;
                destinations_description: string;
                blog: string;
                blog_description: string;
                sustainable_travel: string;
                sustainable_travel_description: string;
                settings: string;
                settings_description: string;
                more: string;
                total_clients: string;
                active_bookings: string;
                monthly_revenue: string;
                conversion_rate: string;
                previous_month: string;
                recent_bookings: string;
                bookings_management: string;
                clients_management: string;
                general_settings: string;
                manage_admin_users: string;
                configure_email_templates: string;
                content_management: string;
                system_settings: string;
                data_backup: string;
                system_logs: string;
                export_data: string;
                activities: string;
                activities_description: string;
                content_hub: string;
                content_hub_description: string;
                financial_dashboard: string;
                financial_dashboard_description: string;
                financialDashboard: string;
                dashboardOverview: string;
                revenueVsExpenses: string;
                profitTrend: string;
                expenseCategories: string;
                totalRevenue: string;
                totalExpenses: string;
                totalProfit: string;
                avgMonthlyProfit: string;
                revenue: string;
                expenses: string;
                profit: string;
                refresh: string;
                export: string;
                account_overview: string;
                account_overview_description: string;
            };
            dateRange: string;
            debug: string;
            delete: string;
            deleteLog: string;
            deleteLogError: string;
            deleteLogsError: string;
            deleteSelected: string;
            destinations: {
                title: string;
                subtitle: string;
                addNew: string;
                refresh: string;
                export: string;
                loading: string;
                loadSuccess: string;
                loadError: string;
                status: {
                    available: string;
                    limited: string;
                    fullybooked: string;
                    unavailable: string;
                };
                stats: {
                    total: string;
                    bookings: string;
                    revenue: string;
                    avgRating: string;
                    featured: string;
                    active: string;
                    totalBookingsDesc: string;
                    totalRevenueDesc: string;
                    totalReviews: string;
                };
                filters: {
                    title: string;
                    clear: string;
                    tabs: {
                        basic: string;
                        advanced: string;
                    };
                    search: string;
                    searchPlaceholder: string;
                    country: string;
                    allCountries: string;
                    category: string;
                    allCategories: string;
                    status: string;
                    allStatus: string;
                    priceRange: string;
                    minRating: string;
                    sortBy: string;
                };
                table: {
                    title: string;
                    page: string;
                    headers: {
                        destination: string;
                        category: string;
                        status: string;
                        price: string;
                        stats: string;
                        actions: string;
                    };
                    empty: string;
                };
                actions: {
                    view: string;
                    clone: string;
                    delete: string;
                    cloneSuccess: string;
                    deleteSuccess: string;
                    bulkDeleteSuccess: string;
                    statusUpdate: string;
                    featuredUpdate: string;
                    addFeatured: string;
                    removeFeatured: string;
                    activate: string;
                    deactivate: string;
                };
                price: {
                    startingFrom: string;
                    perDay: string;
                };
                selection: {
                    count: string;
                    clear: string;
                    delete: string;
                };
                confirmDelete: {
                    title: string;
                    message: string;
                    bulkMessage: string;
                };
            };
            draft: string;
            edit: string;
            enterSearchTerm: string;
            error: string;
            errorLoadingData: string;
            errorOccurred: string;
            expand: string;
            export: string;
            exportAsCSV: string;
            exportAsJSON: string;
            exportError: string;
            exportLogs: string;
            exportSuccess: string;
            failed: string;
            filters: {
                apply: string;
                clear: string;
                search: string;
                status: {
                    all: string;
                    active: string;
                    inactive: string;
                    pending: string;
                    completed: string;
                    cancelled: string;
                };
                date: {
                    today: string;
                    yesterday: string;
                    thisWeek: string;
                    lastWeek: string;
                    thisMonth: string;
                    lastMonth: string;
                    customRange: string;
                };
            };
            financial: {
                title: string;
                dashboardOverview: string;
                revenueVsExpenses: string;
                profitTrend: string;
                expenseCategories: string;
                annualSummary: string;
                totalRevenue: string;
                totalExpenses: string;
                totalProfit: string;
                avgMonthlyProfit: string;
                revenue: string;
                expenses: string;
                profit: string;
                transactions: string;
                noFinancialData: string;
                vsPreviousMonth: string;
                export: string;
                refresh: string;
            };
            footer: {
                adminLabel: string;
                admin: string;
                description: string;
                management: string;
                users: string;
                bookings: string;
                analytics: string;
                settings: string;
                content: string;
                posts: string;
                pages: string;
                media: string;
                newsletters: string;
                ecommerce: string;
                products: string;
                orders: string;
                financial: string;
                destinations: string;
                system: string;
                logs: string;
                maintenance: string;
                backup: string;
                security: string;
                support: string;
                documentation: string;
                supportTech: string;
                privacy: string;
                terms: string;
                quickDashboard: string;
                quickReports: string;
                goTo: string;
                copyrightLabel: string;
                version: string;
                versionLabel: string;
                lastUpdate: string;
            };
            forms: {
                save: string;
                cancel: string;
                delete: string;
                edit: string;
                create: string;
                update: string;
                reset: string;
                submit: string;
                back: string;
                next: string;
                previous: string;
                required: string;
                optional: string;
                success: string;
                error: string;
                warning: string;
                info: string;
                loading: string;
                search: string;
                noResults: string;
                selectPlaceholder: string;
                datePlaceholder: string;
            };
            from: string;
            info: string;
            ip: string;
            level: string;
            loading: string;
            logDeleted: string;
            logDetails: string;
            login: {
                welcome: string;
                subtitle: string;
                title: string;
                emailLabel: string;
                emailPlaceholder: string;
                passwordLabel: string;
                passwordPlaceholder: string;
                rememberMe: string;
                forgotPassword: string;
                submit: string;
                submitting: string;
                noAccount: string;
                registerLink: string;
                notAdmin: string;
                backToSite: string;
            };
            logsDeleted: string;
            message: string;
            logo: {
                link: string;
            };
            logout: string;
            mobile_menu: {
                toggle: string;
                title: string;
            };
            navigation: {
                main: string;
                dashboard: string;
                modernDashboard: string;
                userManagement: string;
                bookingHistory: string;
                destinations: string;
                blogPosts: string;
                newsletters: string;
                financialOverview: string;
                aiAssistant: string;
                reportsAnalytics: string;
                systemLogs: string;
                technicalSupport: string;
                securityControls: string;
                systemSettings: string;
                needHelp: string;
                docs: string;
                readDocs: string;
                systemOnline: string;
                management: string;
                system: string;
                ai_management: string;
                maintenance: string;
                help: string;
                view_site: string;
            };
            noDataAvailable: string;
            noLogs: string;
            noLogsFound: string;
            notifications: {
                success: string;
                error: string;
                warning: string;
                info: string;
                saved: string;
                deleted: string;
                updated: string;
                created: string;
            };
            pagination: {
                itemsPerPage: string;
                of: string;
                previous: string;
                next: string;
                first: string;
                last: string;
            };
            panelTitle: string;
            payment: string;
            pleaseWait: string;
            recentLogs: string;
            refresh: string;
            register: {
                welcome: string;
                subtitle: string;
                title: string;
                errorTitle: string;
                nameLabel: string;
                namePlaceholder: string;
                emailLabel: string;
                emailPlaceholder: string;
                passwordLabel: string;
                passwordPlaceholder: string;
                confirmPasswordLabel: string;
                confirmPasswordPlaceholder: string;
                submit: string;
                submitting: string;
                haveAccount: string;
                loginLink: string;
                backToSite: string;
                copyright: string;
                validation: {
                    required: string;
                    passwordMismatch: string;
                    success: string;
                    error: string;
                };
            };
            retry: string;
            save: string;
            scheduled: string;
            search: {
                placeholder: string;
                aria_label: string;
                no_results: string;
                suggestion_hint: string;
                results_found: string;
                no_results_suggestion: string;
                category_match: string;
                suggestion: string;
            };
            searchInLogs: string;
            security: string;
            selectAll: string;
            sent: string;
            sidebar: {
                label: string;
                footerAriaLabel: string;
            };
            success: string;
            system: string;
            theme: {
                toggle: string;
                Dark: string;
                Light: string;
                System: string;
                Theme: string;
                Simple: string;
            };
            timestamp: string;
            to: string;
            tryAgain: string;
            user: string;
            userAgent: string;
            userRole: {
                role_admin: string;
            };
            users: {
                title: string;
                subtitle: string;
                addUserDesc: string;
                editUserDesc: string;
                addNew: string;
                search: string;
                filters: string;
                deleteSelected: string;
                table: {
                    name: string;
                    email: string;
                    role: string;
                    status: string;
                    lastLogin: string;
                    actions: string;
                    joined: string;
                    showing: string;
                    joinDate: string;
                    password: string;
                    empty: string;
                };
                pagination: {
                    previous: string;
                    next: string;
                };
                roles: {
                    all: string;
                    admin: string;
                    editor: string;
                    viewer: string;
                };
                status: {
                    all: string;
                    active: string;
                    inactive: string;
                    suspended: string;
                };
            };
            users_description: string;
            validation: {
                required: string;
                email: string;
                minLength: string;
                maxLength: string;
                passwordsDontMatch: string;
                invalidFormat: string;
                invalidUrl: string;
                invalidDate: string;
            };
            viewLogDetails: string;
            warning: string;
        };
        readonly 'ai-preferences': {
            common: {
                notSet: string;
                unknown: string;
                cancel: string;
                clear: string;
                minutesShort: string;
                ai: string;
            };
            localModel: {
                specs: {
                    model: string;
                    size: string;
                    context: string;
                    memory: string;
                };
                benefits: {
                    zeroApiCosts: string;
                    completePrivacy: string;
                    offlineCapability: string;
                };
            };
            privacyTrust: {
                features: {
                    localProcessing: {
                        title: string;
                        description: string;
                    };
                    dataPrivacy: {
                        title: string;
                        description: string;
                    };
                    noDataCollection: {
                        title: string;
                        description: string;
                    };
                    offlineCapability: {
                        title: string;
                        description: string;
                    };
                };
                trustIndicators: {
                    zeroApiCosts: string;
                    noRateLimits: string;
                    completeDataOwnership: string;
                    gdprCompliant: string;
                    noThirdPartyDependencies: string;
                    openSourceModel: string;
                };
            };
            advancedSettings: {
                performance: {
                    title: string;
                    description: string;
                    cache: {
                        title: string;
                        description: string;
                        active: string;
                        hitRate: string;
                    };
                };
                dataIntegration: {
                    title: string;
                    description: string;
                };
                integrations: {
                    title: string;
                    description: string;
                    enableRealTimeData: string;
                    enableWeatherIntegration: string;
                    enableCurrencyConversion: string;
                };
                experimental: {
                    title: string;
                    description: string;
                    beta: string;
                    warning: string;
                    notAvailable: string;
                };
                metrics: {
                    title: string;
                    averageResponseTime: string;
                    cacheHitRate: string;
                    successRate: string;
                    totalRequests: string;
                };
                apiStatus: {
                    title: string;
                    openai: string;
                    weather: string;
                    currency: string;
                    connected: string;
                    active: string;
                    inactive: string;
                    error: string;
                    disconnected: string;
                };
            };
            aiPoweredFeatures: {
                profileAnalysis: {
                    title: string;
                    empty: string;
                };
                travelerProfile: {
                    title: string;
                    travelerType: string;
                    primaryInterests: string;
                };
            };
            modelTab: {
                hero: {
                    title: string;
                    subtitle: string;
                };
                sections: {
                    modelSelection: {
                        title: string;
                        subtitle: string;
                    };
                    parameters: {
                        title: string;
                        subtitle: string;
                    };
                    aiFeatures: {
                        title: string;
                        subtitle: string;
                        badge: string;
                    };
                    performance: {
                        title: string;
                        subtitle: string;
                    };
                    dataIntegration: {
                        title: string;
                        subtitle: string;
                    };
                };
                labels: {
                    model: string;
                    temperature: string;
                    maxTokens: string;
                    status: string;
                    configured: string;
                    incomplete: string;
                    setupInProgress: string;
                };
                groups: {
                    coreSettings: string;
                    advanced: string;
                };
            };
            welcome: {
                title: string;
                subtitle: string;
                button: string;
            };
            status: {
                synced: string;
                loading: string;
                syncing: string;
                hasChanges: string;
                unsaved: string;
            };
            import: {
                tooltip: string;
                success: string;
                successDescription: string;
            };
            reset: {
                tooltip: string;
                success: string;
                successDescription: string;
                dialog: {
                    title: string;
                    description: string;
                    confirm: string;
                    cancel: string;
                };
            };
            description: string;
            activities: {
                museums: string;
                gastronomy: string;
                nightlife: string;
                shopping: string;
                watersports: string;
                hiking: string;
                photography: string;
                architecture: string;
                festivals: string;
                nature: string;
                beaches: string;
                mountains: string;
                spa: string;
                adventure: string;
                heritage: string;
                hiking_extra: string;
                nightlife_extra: string;
                shopping_extra: string;
                culinary: string;
            };
            currencies: {
                EUR: string;
                USD: string;
                GBP: string;
                BRL: string;
            };
            errorResetting: string;
            errorSaving: string;
            advanced: {
                title: string;
                description: string;
                comingSoon: string;
                recommendations: {
                    title: string;
                    subtitle: string;
                    enabledLabel: string;
                    featuresTitle: string;
                };
                dataSharing: {
                    title: string;
                    subtitle: string;
                    generalLabel: string;
                    personalizedLabel: string;
                    analyticsLabel: string;
                    marketingLabel: string;
                };
                notifications: {
                    title: string;
                    subtitle: string;
                    enabledLabel: string;
                    channelsLabel: string;
                    typesLabel: string;
                    channelSelected: string;
                    channelNotSelected: string;
                };
                loyalty: {
                    title: string;
                    subtitle: string;
                    noPrograms: string;
                    addButton: string;
                };
            };
            languages: {
                pt: string;
                en: string;
                es: string;
                fr: string;
                de: string;
                it: string;
            };
            loading: string;
            loadingStats: string;
            page: {
                title: string;
                subtitle: string;
            };
            modelSettings: {
                title: string;
                description: string;
                selectedModel: string;
                modelInfo: string;
                maxTokens: string;
                costPerToken: string;
                capabilities: string;
                parameters: {
                    title: string;
                    description: string;
                    temperature: {
                        label: string;
                        description: string;
                        levels: {
                            focused: string;
                            balanced: string;
                            creative: string;
                        };
                    };
                    maxTokensParam: {
                        label: string;
                        description: string;
                    };
                    topP: {
                        label: string;
                        description: string;
                    };
                    frequencyPenalty: {
                        label: string;
                        description: string;
                    };
                    presencePenalty: {
                        label: string;
                        description: string;
                    };
                };
            };
            personalization: {
                personality: {
                    title: string;
                    description: string;
                    personalityType: string;
                    professional: {
                        label: string;
                        description: string;
                        example: string;
                    };
                    friendly: {
                        label: string;
                        description: string;
                        example: string;
                    };
                    enthusiastic: {
                        label: string;
                        description: string;
                        example: string;
                    };
                    detailed: {
                        label: string;
                        description: string;
                        example: string;
                    };
                    concise: {
                        label: string;
                        description: string;
                        example: string;
                    };
                };
                responseLength: {
                    title: string;
                    description: string;
                    short: {
                        label: string;
                        description: string;
                    };
                    medium: {
                        label: string;
                        description: string;
                    };
                    detailed: {
                        label: string;
                        description: string;
                    };
                };
                features: {
                    title: string;
                    description: string;
                    includeLocalTips: string;
                    includeBudgetBreakdown: string;
                    includeAlternatives: string;
                };
                settings: {
                    title: string;
                    description: string;
                    selected: string;
                    selectedType: string;
                    stars: string;
                    dietary: {
                        label: string;
                        none_selected: string;
                        removeAriaLabel: string;
                        options: {
                            vegetarian: string;
                            vegan: string;
                            glutenfree: string;
                            dairyfree: string;
                            nutfree: string;
                            lowcarb: string;
                            cholesterolfree: string;
                        };
                    };
                    pacing: {
                        label: string;
                        placeholder: string;
                        none_selected: string;
                        descriptions: {
                            fast: string;
                            moderate: string;
                            slow: string;
                        };
                        fast: string;
                        moderate: string;
                        slow: string;
                    };
                    accessibility: {
                        label: string;
                        none_selected: string;
                        removeAriaLabel: string;
                        options: {
                            screenreader: string;
                            closedcaptions: string;
                            wheelchair: string;
                        };
                    };
                    accommodation: {
                        label: string;
                        placeholder: string;
                        options: {
                            hotel: string;
                            resort: string;
                            airbnb: string;
                            hostel: string;
                            apartment: string;
                            accessible: string;
                        };
                    };
                    cruise: {
                        toggle: {
                            label: string;
                        };
                        hint: string;
                        collapsedHint: string;
                        types: {
                            river: {
                                title: string;
                                subtitle: string;
                            };
                            sea: {
                                title: string;
                                subtitle: string;
                            };
                        };
                        regions: {
                            riverTitle: string;
                            seaTitle: string;
                            options: {
                                european: string;
                                asian: string;
                                african: string;
                                american: string;
                                caribbean: string;
                                mediterranean: string;
                                alaska: string;
                                nordic: string;
                                transatlantic: string;
                            };
                        };
                        duration: {
                            title: string;
                            options: {
                                short: {
                                    label: string;
                                    days: string;
                                };
                                medium: {
                                    label: string;
                                    days: string;
                                };
                                long: {
                                    label: string;
                                    days: string;
                                };
                            };
                        };
                        cabin: {
                            title: string;
                            options: {
                                interior: {
                                    label: string;
                                    description: string;
                                };
                                oceanview: {
                                    label: string;
                                    description: string;
                                };
                                balcony: {
                                    label: string;
                                    description: string;
                                };
                                suite: {
                                    label: string;
                                    description: string;
                                };
                            };
                        };
                    };
                };
            };
            review: {
                ready: string;
                hint: string;
                completeSetup: string;
                modifyLater: string;
                enabled: string;
                disabled: string;
                missing: string;
                complete: string;
                applied: string;
                sections: {
                    basics: {
                        title: string;
                    };
                    personalization: {
                        title: string;
                    };
                    travel: {
                        title: string;
                    };
                    model: {
                        title: string;
                    };
                    privacy: {
                        title: string;
                    };
                };
                fields: {
                    activities: string;
                    budget: string;
                    destination: string;
                    dates: string;
                    travelers: string;
                    model: string;
                    creativity: string;
                    responseLength: string;
                    dataSharing: string;
                    analytics: string;
                    notifications: string;
                };
            };
            preferencesReset: string;
            preferencesSaved: string;
            preferencesUpdated: string;
            privacySettings: {
                title: string;
                description: string;
                saveSearchHistory: string;
                "shareDataFor Improvement": string;
                allowPersonalization: string;
            };
            restoreDefaults: string;
            saveChanges: string;
            saving: string;
            model: {
                title: string;
                description: string;
                selectedModel: string;
                modelInfo: {
                    title: string;
                };
                maxTokens: string;
                costPerToken: string;
                costWarning: {
                    title: string;
                    message: string;
                };
                resetToDefaults: string;
                status: {
                    available: string;
                    unavailable: string;
                    comingSoon: string;
                };
                estimatedMonthlyCost: string;
                performance: {
                    title: string;
                    speed: string;
                    accuracy: string;
                    creativity: string;
                };
                capabilities: {
                    title: string;
                };
            };
            parameters: {
                title: string;
                description: string;
                temperature: {
                    label: string;
                    description: string;
                    levels: {
                        focused: string;
                        balanced: string;
                        creative: string;
                    };
                };
                maxTokens: {
                    label: string;
                    description: string;
                    words: string;
                };
                topP: {
                    label: string;
                    description: string;
                };
                frequencyPenalty: {
                    label: string;
                    description: string;
                };
                presencePenalty: {
                    label: string;
                    description: string;
                };
                advanced: {
                    title: string;
                };
            };
            form: {
                title: string;
                saveDraft: string;
                next: string;
                previous: string;
                complete: string;
                completedSuccess: string;
                completedError: string;
                tabs: {
                    basics: string;
                    budget: string;
                    personalization: string;
                    sustainable: string;
                    model: string;
                    privacy: string;
                    review: string;
                };
            };
            travelPreferences: {
                budget: {
                    title: string;
                    description: string;
                    badge: string;
                    currencyLabel: string;
                    currencyPlaceholder: string;
                    rangeLabel: string;
                    maxBudgetPercent: string;
                    info: string;
                    defaultTitle: string;
                    rangeTitle: string;
                    rangeSubtitle: string;
                    amplitude: string;
                    presetAriaLabel: string;
                    minLabel: string;
                    maxLabel: string;
                    minTooltip: string;
                    maxTooltip: string;
                    visualizationTitle: string;
                    minShort: string;
                    available: string;
                    errors: {
                        multipleIssues: string;
                    };
                    presets: {
                        economic: string;
                        balanced: string;
                        premium: string;
                    };
                };
                travelStyle: {
                    title: string;
                    description: string;
                    travelersLabel: string;
                    selector: {
                        title: string;
                        subtitle: string;
                        selected: string;
                        recommendedActivities: string;
                    };
                    types: {
                        luxury: {
                            label: string;
                            description: string;
                        };
                        comfort: {
                            label: string;
                            description: string;
                        };
                        budget: {
                            label: string;
                            description: string;
                        };
                        adventure: {
                            label: string;
                            description: string;
                        };
                        cultural: {
                            label: string;
                            description: string;
                        };
                        relaxation: {
                            label: string;
                            description: string;
                        };
                    };
                    luxury: {
                        label: string;
                        description: string;
                    };
                    comfort: {
                        label: string;
                        description: string;
                    };
                    budget: {
                        label: string;
                        description: string;
                    };
                    adventure: {
                        label: string;
                        description: string;
                    };
                    cultural: {
                        label: string;
                        description: string;
                    };
                    relaxation: {
                        label: string;
                        description: string;
                    };
                };
                sustainability: {
                    title: string;
                    description: string;
                    levelLabel: string;
                    levelDescription: string;
                    ecoLabel: string;
                    ecoDescription: string;
                    infoTooltip: string;
                    certificationsLabel: string;
                    certificationsDescription: string;
                    summaryTitle: string;
                    summaryBody: string;
                    impactLevels: {
                        excellent: string;
                        good: string;
                        moderate: string;
                        tobetter: string;
                    };
                    indicators: {
                        low: string;
                        high: string;
                        score: string;
                    };
                    low: {
                        label: string;
                        description: string;
                        impact: string;
                    };
                    medium: {
                        label: string;
                        description: string;
                        impact: string;
                    };
                    high: {
                        label: string;
                        description: string;
                        impact: string;
                    };
                    ecoPreferencesOptions: {
                        carbon_offsetting: {
                            label: string;
                            description: string;
                        };
                        eco_hotels: {
                            label: string;
                            description: string;
                        };
                        public_transport: {
                            label: string;
                            description: string;
                        };
                        local_food: {
                            label: string;
                            description: string;
                        };
                        wildlife_protection: {
                            label: string;
                            description: string;
                        };
                        water_conservation: {
                            label: string;
                            description: string;
                        };
                        renewable_energy: {
                            label: string;
                            description: string;
                        };
                        zero_waste: {
                            label: string;
                            description: string;
                        };
                    };
                    certificationsOptions: {
                        leed: {
                            label: string;
                            description: string;
                        };
                        green_key: {
                            label: string;
                            description: string;
                        };
                        blue_flag: {
                            label: string;
                            description: string;
                        };
                        earth_check: {
                            label: string;
                            description: string;
                        };
                        green_globe: {
                            label: string;
                            description: string;
                        };
                        eco_label: {
                            label: string;
                            description: string;
                        };
                        none: {
                            label: string;
                            description: string;
                        };
                    };
                };
                travelers: {
                    title: string;
                    description: string;
                };
                activities: {
                    title: string;
                    description: string;
                    addActivity: string;
                    popularActivities: string;
                    selectedLabel: string;
                    clearAll: string;
                    availableLabel: string;
                    limitReached: string;
                    searchPlaceholder: string;
                    limitAlert: string;
                    alreadySelected: string;
                    selectActivity: string;
                    removeActivity: string;
                };
                suggestions: {
                    title: string;
                    available: string;
                    match: string;
                    potentialSavings: string;
                    category: string;
                    moreAvailable: string;
                    footer: string;
                    dismiss: string;
                    sugestion: string;
                };
            };
            usageAnalytics: {
                title: string;
                totalRequests: string;
                tokensUsed: string;
                averageResponseTime: string;
                successRate: string;
                favoriteFeatures: string;
                monthlyUsage: string;
                performanceInsights: string;
                performanceInsightsDescription: string;
                usagePatterns: string;
                mostActiveTime: string;
                preferredDay: string;
                avgSessionDuration: string;
                recommendations: string;
                optimization: string;
                optimizationDesc: string;
                personalization: string;
                personalizationDesc: string;
                achievement: string;
                achievementDesc: string;
                monthlyUsageDescription: string;
                monthlyGrowth: string;
                favoriteFeaturesDescription: string;
            };
            dashboard: {
                intelligenceScore: string;
                configurationSteps: string;
                overallProgress: string;
                scoreCards: {
                    intelligence: {
                        title: string;
                        subtitle: string;
                    };
                    traveler: {
                        title: string;
                        subtitle: string;
                    };
                    sustainability: {
                        title: string;
                        subtitle: string;
                    };
                };
                navigation: {
                    previous: string;
                    continue: string;
                    completeSetup: string;
                };
                auth: {
                    saveTitle: string;
                    saveDescription: string;
                    loginButton: string;
                };
            };
            steps: {
                profile: {
                    label: string;
                    description: string;
                };
                style: {
                    label: string;
                    description: string;
                };
                budget: {
                    label: string;
                    description: string;
                };
                preferences: {
                    label: string;
                    description: string;
                };
                activities: {
                    label: string;
                    description: string;
                };
                accessibility: {
                    label: string;
                    description: string;
                };
                settings: {
                    label: string;
                    description: string;
                };
            };
            languageSelection: {
                title: string;
                selectedTitle: string;
                addLanguage: string;
                chooseLanguage: string;
                noneSelected: string;
                searchPlaceholder: string;
                noResults: string;
                recommendationsTitle: string;
                clickToAdd: string;
                proficiency: string;
                basic: string;
                intermediate: string;
                fluent: string;
                chooseProficiency: string;
            };
            days: {
                monday: string;
                tuesday: string;
                wednesday: string;
                thursday: string;
                friday: string;
                saturday: string;
                sunday: string;
            };
        };
        readonly auth: {
            accessDenied: string;
            back_to_home: string;
            create_account: string;
            email_label: string;
            email_placeholder: string;
            exclusive_trips: string;
            facebook_sign_in: string;
            forgot_password: string;
            google_sign_in: string;
            insufficientPermissions: string;
            invalid_credentials: string;
            login: {
                title: string;
                subtitle: string;
                email: string;
                emailRequired: string;
                invalidEmail: string;
                password: string;
                passwordRequired: string;
                passwordMinLength: string;
                rememberMe: string;
                signIn: string;
                orSignInWithEmail: string;
            };
            loginRequired: string;
            no_account: string;
            or: string;
            password_label: string;
            password_placeholder: string;
            pleaseLoginToContinue: string;
            register: string;
            remember_me: string;
            required_fields: string;
            secure: string;
            sign_in: string;
            signing_in: string;
            subtitle: string;
            success: string;
            support: string;
            unexpected_error: string;
            welcome: string;
        };
        readonly blog: {
            back: string;
            categories: {
                destinations: string;
                "conseils-voyage": string;
                aventure: string;
                gastronomie: string;
                ecotourisme: string;
                culture: string;
                itineraires: string;
                Destinos: string;
                "Dicas de Viagem": string;
                Aventura: string;
                Gastronomia: string;
                Ecoturismo: string;
                Cultura: string;
                Roteiros: string;
            };
            featured: {
                title: string;
                subtitle: string;
                readArticle: string;
            };
            footer: {
                copyright: string;
                terms: string;
                privacy: string;
            };
            hero: {
                badge: string;
                title: string;
                subtitle: string;
            };
            loadMore: string;
            meta: {
                title: string;
                description: string;
                keywords: string;
            };
            posts: {
                title: string;
                readMore: string;
                readTime: string;
                backToBlog: string;
                resultsFound: string;
                noResults: {
                    title: string;
                    description: string;
                };
            };
            relatedDestinations: string;
            relatedPosts: string;
            relatedServices: string;
            search: {
                placeholder: string;
                allCategories: string;
            };
            sidebar: {
                recentPosts: string;
                newsletter: {
                    title: string;
                    description: string;
                    placeholder: string;
                    subscribe: string;
                    success: string;
                    error: string;
                };
            };
            filtersPanel: {
                title: string;
                clear: string;
                search: {
                    label: string;
                    placeholder: string;
                };
                category: {
                    label: string;
                    placeholder: string;
                };
                tag: {
                    label: string;
                    placeholder: string;
                };
                sort: {
                    label: string;
                    options: {
                        recent: string;
                        popular: string;
                        az: string;
                        za: string;
                    };
                };
                updating: string;
            };
            searchAndFilter: {
                search: {
                    placeholder: string;
                    submit: string;
                };
            };
            newsletterInline: {
                title: string;
                description: string;
                emailPlaceholder: string;
                subscribe: string;
            };
            popularCategories: {
                title: string;
                items: {
                    beaches: string;
                    ecotourism: string;
                    gastronomy: string;
                    culture: string;
                    adventure: string;
                };
            };
            grid: {
                range: {
                    empty: string;
                    showing: string;
                };
                noResults: {
                    title: string;
                    titleWithQuery: string;
                    description: string;
                    descriptionWithQuery: string;
                    viewAll: string;
                };
                activeFilters: {
                    category: string;
                    tag: string;
                    search: string;
                    clearAll: string;
                };
                pagination: {
                    previous: string;
                    next: string;
                    page: string;
                };
            };
            article: {
                actions: {
                    viewAll: string;
                };
                loadError: {
                    title: string;
                    description: string;
                };
                content: {
                    unavailable: string;
                    loading: string;
                };
                footer: {
                    lastUpdated: string;
                };
                meta: {
                    readingTimeMinutes: string;
                    siteNameFallback: string;
                    fallbackDescription: string;
                    fallbackOpenGraphTitle: string;
                    fallbackOpenGraphDescription: string;
                    twitterHandleFallback: string;
                    notFoundTitle: string;
                };
            };
        };
        readonly booking: {
            buttons: {
                back: string;
                continue: string;
                confirm: string;
            };
            destinations: {
                santorini: {
                    name: string;
                    duration: string;
                    includes: string[];
                };
                tokyo: {
                    name: string;
                    duration: string;
                    includes: string[];
                };
                bali: {
                    name: string;
                    duration: string;
                    includes: string[];
                };
            };
            pageTitle: string;
            perPersonSuffix: string;
            step1: {
                title: string;
                departureDate: string;
                returnDate: string;
                travelers: string;
                travelerCount_one: string;
                travelerCount_other: string;
                accommodation: {
                    title: string;
                    options: {
                        standard: string;
                        premium: string;
                        luxury: string;
                    };
                    pricePrefix: string;
                    included: string;
                };
                specialRequests: {
                    label: string;
                    placeholder: string;
                };
            };
            step2: {
                title: string;
                fullName: string;
                fullNamePlaceholder: string;
                email: string;
                emailPlaceholder: string;
                phone: string;
                phonePlaceholder: string;
                document: string;
                documentPlaceholder: string;
                security: {
                    title: string;
                    description: string;
                };
            };
            step3: {
                title: string;
                travelerCount_one: string;
                travelerCount_other: string;
                rating: string;
                priceDetails: {
                    title: string;
                    basePackage: string;
                    accommodationUpgrade: string;
                    taxes: string;
                };
                included: {
                    title: string;
                    travelInsurance: string;
                    support: string;
                };
                policies: {
                    title: string;
                    cancellation: string;
                    changes: string;
                    documentation: string;
                    vaccines: string;
                };
                total: string;
            };
            step4: {
                title: string;
                paymentMethod: {
                    title: string;
                    credit: {
                        name: string;
                        description: string;
                    };
                    pix: {
                        name: string;
                        description: string;
                    };
                };
                creditCard: {
                    number: string;
                    numberPlaceholder: string;
                    expiry: string;
                    expiryPlaceholder: string;
                    cvv: string;
                    cvvPlaceholder: string;
                    name: string;
                    namePlaceholder: string;
                };
                pix: {
                    title: string;
                    description: string;
                    totalWithDiscount: string;
                };
                terms: {
                    agree: string;
                    service: string;
                    privacy: string;
                };
                orderSummary: {
                    title: string;
                    subtotal: string;
                    taxes: string;
                    pixDiscount: string;
                    securePayment: string;
                    instantConfirmation: string;
                };
            };
        };
        readonly bookings: {
            bookNow: string;
            getStarted: string;
            noBookings: string;
            subtitle: string;
            title: string;
        };
        readonly careers: {
            hero: {
                title: string;
                subtitle: string;
                badge: string;
            };
            benefits: {
                title: string;
                health: string;
                health_desc: string;
                flex: string;
                flex_desc: string;
                growth: string;
                growth_desc: string;
                tech: string;
                tech_desc: string;
            };
            cta: {
                badge: string;
                title: string;
                subtitle: string;
                button: string;
            };
            form: {
                title: string;
            };
            application: {
                title: string;
                close: string;
                name: string;
                email: string;
                phone: string;
                linkedin: string;
                message: {
                    label: string;
                    placeholder: string;
                };
                cv: {
                    label: string;
                    upload: string;
                    drag: string;
                    format: string;
                };
                error: string;
                submitting: string;
                submit: string;
                success: {
                    title: string;
                    message: string;
                };
            };
            job: {
                none: string;
                checkback: string;
                spontaneous: string;
                apply: {
                    label: string;
                    aria: string;
                };
                requirements_label: string;
                benefits_label: string;
            };
            jobs: {
                empty: {
                    title: string;
                    department: string;
                    general: string;
                    checkback: string;
                };
            };
            departments: {
                empty: {
                    title: string;
                    subtitle: string;
                };
            };
            open_positions: string;
            opportunities: string;
            sections: {
                whyJoinUs: {
                    title: string;
                    description: string;
                };
                openPositions: {
                    title: string;
                    noPositions: string;
                };
            };
        };
        readonly chat: {
            inputPlaceholder: string;
            openChat: string;
            talkToUs: string;
            title: string;
            welcome: string;
            welcomeMessage: string;
        };
        readonly common: {
            tryAgain: string;
            close: string;
            actions: string;
            slogan: string;
            phone: string;
            email: string;
            address: {
                city: string;
                street: string;
            };
            ui: {
                edit: string;
                loading: string;
                error: string;
                retry: string;
                close: string;
                save: string;
                cancel: string;
                confirm: string;
                delete: string;
                view: string;
                show: string;
                show_less: string;
                show_more: string;
                hide: string;
                add: string;
                remove: string;
                create: string;
                update: string;
                submit: string;
                search: string;
                select: string;
                choose: string;
                book: string;
                join: string;
                overview: string;
                notAvailable: string;
                emailPlaceholder: string;
            };
            available: string;
            booking: string;
            searching: string;
            day: string;
            days: string;
            roundTrip: string;
            returnDate: string;
            header: {
                brand: string;
                tagline: string;
                menu: string;
                notifications: string;
                profile: string;
                settings: string;
                billing: string;
                help: string;
                login: string;
                logout: string;
                user: string;
            };
            theme: {
                dark: string;
                light: string;
                toggleTitle: string;
                moreOptions: string;
                toggleAriaLabel: string;
                switchToDark: string;
                toggle: string;
            };
            admin: {
                actions: string;
                edit: string;
                dashboard: string;
                users: string;
                settings: string;
                blog: {
                    title: string;
                    posts: string;
                    create_post: string;
                    title_placeholder: string;
                    content_placeholder: string;
                    draft: string;
                    published: string;
                    create: string;
                    existing_posts: string;
                    slug: string;
                    date: string;
                    status: string;
                };
                social: {
                    posts: string;
                    create_post: string;
                    content_placeholder: string;
                    schedule: string;
                    existing_posts: string;
                    platform: string;
                    content: string;
                    scheduled_date: string;
                    status: string;
                };
                sustainable_travel: {
                    title: string;
                    page_content: string;
                    add_initiative: string;
                    hero_title: string;
                    hero_description: string;
                    mission_statement: string;
                    initiatives: string;
                    initiative_title: string;
                    initiative_description: string;
                };
                routeTransition: {
                    loading: string;
                };
            };
            auth: {
                login: string;
                register: string;
            };
            buttons: {
                getStarted: string;
            };
            cancel: string;
            company: {
                founder: string;
                founderAlt: string;
                founderTitle: string;
                slogan: string;
                name: string;
                address: string;
                phone: string;
                email: string;
            };
            companyInfo: {
                name: string;
                slogan: string;
                address: string;
                phone: string;
            };
            delete: string;
            dismiss: string;
            edit: string;
            explore_now: string;
            featured: string;
            form: {
                activities: string;
                additionalInfo: string;
                budget: string;
                dates: string;
                destinations: string;
                dietary: string;
                duration: string;
                email: string;
                groupSize: string;
                name: string;
                personalInfo: string;
                phone: string;
                specialRequests: string;
                submit: string;
                travelStyle: string;
            };
            high: string;
            learnMore: string;
            loading: string;
            low: string;
            medium: string;
            newsletter: {
                stayUpdated: string;
                dealsAndNews: string;
                description: string;
                emailLabel: string;
                emailPlaceholder: string;
                subscribeButton: string;
                title: string;
            };
            partnerships: {
                title: string;
                dg: string;
                gea: string;
                sanjotec: string;
                turismodeportugal: string;
            };
            paymentMethods: {
                transfer: string;
            };
            profile: {
                account_menu: string;
                profile: string;
                logout: string;
                logout_success: string;
                personal: string;
                contact: string;
                preferences: string;
                payment: string;
                privacy: string;
                title: string;
                description: string;
                edit: string;
                newsletter: {
                    title: string;
                    subtitle: string;
                };
                buttons: {
                    newCampaign: string;
                    refreshList: string;
                };
                stats: {
                    totalSubscribers: string;
                    activeSubscribers: string;
                    totalCampaigns: string;
                    sentCampaigns: string;
                    avgOpenRate: string;
                    avgOpenRateDesc: string;
                };
                tabs: {
                    campaigns: string;
                    subscribers: string;
                    templates: string;
                    analytics: string;
                };
                tableHeaders: {
                    subject: string;
                    status: string;
                    recipients: string;
                    sentAt: string;
                    openRate: string;
                    createdAt: string;
                    email: string;
                    name: string;
                    language: string;
                    tags: string;
                    actions: string;
                };
                subscribers: {
                    title: string;
                    description: string;
                    searchPlaceholder: string;
                    noData: string;
                };
                templates: {
                    title: string;
                    description: string;
                };
                analytics: {
                    title: string;
                    description: string;
                };
                comingSoon: string;
                completeness: string;
                complete: string;
                email_verified: string;
                phone_not_verified: string;
                personal_data: string;
                personal_data_description: string;
                first_name: string;
                last_name: string;
                email: string;
                phone: string;
                date_of_birth: string;
                nationality: string;
                tax_id: string;
                gender: string;
                male: string;
                female: string;
                other: string;
                prefer_not_to_say: string;
                marital_status: string;
                single: string;
                married: string;
                divorced: string;
                widowed: string;
                address: string;
                address_description: string;
                street: string;
                number: string;
                complement: string;
                neighborhood: string;
                city: string;
                state: string;
                postal_code: string;
                country: string;
                travel_preferences: string;
                travel_preferences_description: string;
                preferred_currency: string;
                euro: string;
                us_dollar: string;
                british_pound: string;
                brazilian_real: string;
                preferred_language: string;
                portuguese: string;
                english: string;
                spanish: string;
                french: string;
                payment_methods: string;
                payment_methods_description: string;
                no_payment_methods: string;
                add_payment_method: string;
                add_payment_method_button: string;
                privacy_settings: string;
                privacy_settings_description: string;
                profile_visibility: string;
                show_email: string;
                show_email_description: string;
                show_phone: string;
                show_phone_description: string;
                show_address: string;
                show_address_description: string;
                notifications: string;
                marketing_emails: string;
                marketing_emails_description: string;
                sms_notifications: string;
                sms_notifications_description: string;
                push_notifications: string;
                push_notifications_description: string;
                data_sharing: string;
                share_data_with_partners: string;
                share_data_with_partners_description: string;
            };
            save: string;
            search: string;
            smartForm: {
                title: string;
                subtitle: string;
                success: {
                    title: string;
                    message: string;
                    button: string;
                };
                fields: {
                    destination: string;
                    dateFrom: string;
                    dateTo: string;
                    travelers: string;
                    travelType: string;
                    budget: string;
                    name: string;
                    phone: string;
                    email: string;
                    message: string;
                };
                placeholders: {
                    destination: string;
                    travelers: string;
                    travelType: string;
                    budget: string;
                    name: string;
                    phone: string;
                    email: string;
                    message: string;
                };
                errors: {
                    nameRequired: string;
                    emailRequired: string;
                    emailInvalid: string;
                    phoneRequired: string;
                    destinationRequired: string;
                    travelTypeRequired: string;
                    budgetRequired: string;
                };
                reset: string;
                submit: string;
                submitting: string;
            };
            socialMediaTitle: string;
            socials: {
                facebookUrl: string;
                instagramUrl: string;
                twitterUrl: string;
            };
            submit: string;
            viewAll: string;
            nav: {
                destinations: string;
                flights: string;
                hotels: string;
                community: string;
                demo: string;
            };
            legal: {
                terms: string;
                privacy: string;
                cookies: string;
                gdpr: string;
                cancellation: string;
            };
            mobile: {
                app: string;
            };
            help: {
                documentation: string;
            };
        };
        readonly community: {
            actions: {
                like: string;
                comment: string;
                share: string;
                save: string;
                report: string;
                follow: string;
                unfollow: string;
                edit: string;
                delete: string;
            };
            hero: {
                title: string;
                subtitle: string;
            };
            notifications: {
                title: string;
                markAllRead: string;
                noNotifications: string;
                newPost: string;
                newComment: string;
                newFollower: string;
                eventReminder: string;
                challengeUpdate: string;
            };
            profile: {
                posts: string;
                followers: string;
                following: string;
                joinedDate: string;
                location: string;
                bio: string;
                travelStats: string;
                countriesVisited: string;
                tripsCompleted: string;
                badges: string;
            };
            sections: {
                feed: {
                    title: string;
                    createPost: string;
                    placeholder: string;
                    postButton: string;
                    noContent: string;
                };
                categories: {
                    title: string;
                    all: string;
                    experiences: string;
                    tips: string;
                    photos: string;
                    reviews: string;
                    questions: string;
                    recommendations: string;
                };
                trending: {
                    title: string;
                    destinations: string;
                    discussions: string;
                    members: string;
                };
                groups: {
                    title: string;
                    joinGroup: string;
                    createGroup: string;
                    myGroups: string;
                    discover: string;
                    members: string;
                    posts: string;
                };
                events: {
                    title: string;
                    upcoming: string;
                    past: string;
                    createEvent: string;
                    joinEvent: string;
                    interested: string;
                    going: string;
                    date: string;
                    location: string;
                    attendees: string;
                };
                leaderboard: {
                    title: string;
                    topContributors: string;
                    mostActive: string;
                    points: string;
                    contributions: string;
                };
                challenges: {
                    title: string;
                    active: string;
                    completed: string;
                    participate: string;
                    reward: string;
                    deadline: string;
                };
            };
        };
        readonly consent: {
            banner: {
                title: string;
                description: string;
                acceptAll: string;
                rejectAll: string;
                customize: string;
                necessary: string;
            };
            categories: {
                necessary: {
                    name: string;
                    description: string;
                    examples: {
                        session: string;
                        security: string;
                        cart: string;
                    };
                };
                functional: {
                    name: string;
                    description: string;
                    examples: {
                        language: string;
                        theme: string;
                        preferences: string;
                    };
                };
                analytics: {
                    name: string;
                    description: string;
                    examples: {
                        usage: string;
                        performance: string;
                        errors: string;
                    };
                };
                marketing: {
                    name: string;
                    description: string;
                    examples: {
                        ads: string;
                        social: string;
                        retargeting: string;
                    };
                };
            };
            legal: {
                learnMore: string;
                privacyPolicy: string;
                cookiePolicy: string;
                dataRetention: string;
            };
            modal: {
                title: string;
                description: string;
                save: string;
                cancel: string;
                acceptAll: string;
                rejectAll: string;
            };
            preferences: {
                title: string;
                lastUpdated: string;
                change: string;
                export: string;
                delete: string;
            };
        };
        readonly contact: {
            contactInfo: {
                items: {
                    icon: string;
                    title: string;
                    details: string[];
                }[];
            };
            faq: {
                title: string;
                subtitle: string;
                items: {
                    question: string;
                    answer: string;
                }[];
            };
            form: {
                title: string;
                subtitle: string;
                fields: {
                    name: {
                        label: string;
                        placeholder: string;
                    };
                    email: {
                        label: string;
                        placeholder: string;
                    };
                    phone: {
                        label: string;
                        placeholder: string;
                    };
                    travelType: {
                        label: string;
                        placeholder: string;
                    };
                    subject: {
                        label: string;
                        placeholder: string;
                    };
                    message: {
                        label: string;
                        placeholder: string;
                    };
                };
                travelTypes: {
                    value: string;
                    label: string;
                }[];
                submitButton: string;
                submittingText: string;
                privacyNotice: string;
                success: {
                    title: string;
                    message: string;
                };
            };
            hero: {
                badge: string;
                title: string;
                subtitle: string;
            };
            map: {
                title: string;
                subtitle: string;
            };
            quickActions: {
                title: string;
                chat: string;
                call: string;
                schedule: string;
            };
            testimonials: {
                title: string;
                subtitle: string;
                items: {
                    name: string;
                    location: string;
                    rating: number;
                    comment: string;
                }[];
            };
        };
        readonly cruises: {
            destinations: {
                caribbean: string;
                caribbean_desc: string;
                mediterranean: string;
                mediterranean_desc: string;
                alaska: string;
                alaska_desc: string;
                norway: string;
                norway_desc: string;
            };
            hero: {
                title: string;
                subtitle: string;
            };
            popularDestinations: {
                title: string;
                subtitle: string;
            };
            search: {
                destination: string;
                destination_placeholder: string;
                date: string;
                cruise_line: string;
                cruise_line_placeholder: string;
                button: string;
            };
            whyChooseUs: {
                title: string;
                subtitle: string;
                exclusive: string;
                exclusive_desc: string;
                luxury: string;
                luxury_desc: string;
                support: string;
                support_desc: string;
            };
        };
        readonly dashboard: {
            dashboard: {
                title: string;
                subtitle: string;
                upcomingTrips: string;
                noUpcomingTrips: string;
                recentBookings: string;
                noRecentBookings: string;
                recommendations: string;
                noRecommendations: string;
            };
        };
        readonly demo: {
            meta: {
                title: string;
                description: string;
            };
            hero: {
                badge: string;
                title: string;
                titleHighlight: string;
                subtitle: string;
                cta: string;
                ctaSecondary: string;
                privacyNote: string;
            };
            flow: {
                title: string;
                subtitle: string;
                phases: {
                    landing: string;
                    preferences: string;
                    searching: string;
                    results: string;
                };
                phaseDescriptions: {
                    landing: string;
                    preferences: string;
                    searching: string;
                    results: string;
                };
            };
            tabs: {
                basics: {
                    title: string;
                    description: string;
                    details: string[];
                };
                budget: {
                    title: string;
                    description: string;
                    details: string[];
                };
                personalization: {
                    title: string;
                    description: string;
                    details: string[];
                };
                sustainability: {
                    title: string;
                    description: string;
                    details: string[];
                };
                model: {
                    title: string;
                    description: string;
                    details: string[];
                };
                privacy: {
                    title: string;
                    description: string;
                    details: string[];
                };
                review: {
                    title: string;
                    description: string;
                    details: string[];
                };
            };
            search: {
                title: string;
                subtitle: string;
                processing: string;
                analyzing: string;
                matching: string;
                complete: string;
                localBadge: string;
                noDataLeaves: string;
            };
            privacy: {
                sectionTitle: string;
                sectionSubtitle: string;
                localLlm: {
                    title: string;
                    description: string;
                };
                noCloud: {
                    title: string;
                    description: string;
                };
                encrypted: {
                    title: string;
                    description: string;
                };
                openSource: {
                    title: string;
                    description: string;
                };
                yourData: {
                    title: string;
                    description: string;
                };
                gdpr: {
                    title: string;
                    description: string;
                };
            };
            features: {
                sectionTitle: string;
                sectionSubtitle: string;
                aiPowered: {
                    title: string;
                    description: string;
                };
                multiTab: {
                    title: string;
                    description: string;
                };
                ecoConscious: {
                    title: string;
                    description: string;
                };
                modelChoice: {
                    title: string;
                    description: string;
                };
                privacyFirst: {
                    title: string;
                    description: string;
                };
                smartSearch: {
                    title: string;
                    description: string;
                };
            };
            cta: {
                title: string;
                subtitle: string;
                button: string;
                footnote: string;
            };
            common: {
                step: string;
                of: string;
                next: string;
                back: string;
                startOver: string;
                learnMore: string;
            };
        };
        readonly destinations: {
            allDestinations: string;
            amazing: string;
            contactUsButton: string;
            contactUsForMoreInfo: string;
            destination1Description: string;
            destination1Name: string;
            destination2Description: string;
            destination2Name: string;
            destinationsFound: string;
            destinationsTitle: string;
            discoverUniquePlaces: string;
            exploreTheWorld: string;
            featuredDestinations: string;
            mostSoughtAfter: string;
            noDestinationsFound: string;
            ourServices: string;
            readyToExplore: string;
            searchDestinations: string;
            selectContinent: string;
            selectPriceRange: string;
            service1Description: string;
            service1Name: string;
            service2Description: string;
            service2Name: string;
            tryAdjustingFilters: string;
            page: {
                featured: {
                    editorialLabel: string;
                    title: string;
                };
                results: {
                    showingPrefix: string;
                    of: string;
                    destinations: string;
                };
                countries: {
                    label: string;
                    more: string;
                };
                filters: {
                    title: string;
                };
                newsletter: {
                    eyebrow: string;
                    title: string;
                    description: string;
                };
            };
        };
        readonly errors: {
            "404": string;
            "500": string;
            "Server Error": string;
            "Service Unavailable": string;
            badGateway: string;
            forbidden: string;
            internalServerError: string;
            notFound: string;
            notImplemented: string;
            unauthorized: string;
        };
        readonly faq: {
            answers: {
                bp_howToBook: string;
                bp_paymentMethods: string;
                bp_installments: string;
                cc_policy: string;
                cc_canIChange: string;
                dt_passport: string;
                dt_visa: string;
                dt_travelInsurance: string;
                dt_healthRequirements: string;
                ds_popularDestinations: string;
                ds_customPackages: string;
                ds_groupTravel: string;
                ds_localGuides: string;
                lc_agencyObligations: string;
                lc_travelerRights: string;
                lc_complaints: string;
                lc_rnavt: string;
                sc_contactMethods: string;
                sc_emergencySupport: string;
                sc_responseTime: string;
                sc_languages: string;
            };
            categories: {
                bookingPayment: string;
                cancellationsChanges: string;
                documentationTravel: string;
                destinationsServices: string;
                legalCompliance: string;
                supportContacts: string;
            };
            contactDetails: {
                phone: string;
                email: string;
            };
            hero: {
                title: string;
                subtitle: string;
            };
            linkTexts: {
                lre: string;
            };
            noResults: string;
            notFound: {
                title: string;
                description: string;
                contactUs: string;
            };
            questions: {
                bp_howToBook: string;
                bp_paymentMethods: string;
                bp_installments: string;
                cc_policy: string;
                cc_canIChange: string;
                dt_passport: string;
                dt_visa: string;
                dt_travelInsurance: string;
                dt_healthRequirements: string;
                ds_popularDestinations: string;
                ds_customPackages: string;
                ds_groupTravel: string;
                ds_localGuides: string;
                lc_agencyObligations: string;
                lc_travelerRights: string;
                lc_complaints: string;
                lc_rnavt: string;
                sc_contactMethods: string;
                sc_emergencySupport: string;
                sc_responseTime: string;
                sc_languages: string;
            };
            searchPlaceholder: string;
        };
        readonly features: {
            categories: {
                core: string;
                advanced: string;
                premium: string;
            };
            cta: {
                title: string;
                subtitle: string;
            };
            features: {
                aiPlanning: {
                    title: string;
                    description: string;
                };
                secureBooking: {
                    title: string;
                    description: string;
                };
                globalDestinations: {
                    title: string;
                    description: string;
                };
                community: {
                    title: string;
                    description: string;
                };
                analytics: {
                    title: string;
                    description: string;
                };
            };
            subtitle: string;
            title: string;
        };
        readonly flights: {
            action: string;
            any: string;
            book: string;
            bookNow: string;
            booking: {
                title: string;
                description: string;
                flightDetails: string;
                passengerInfo: string;
                name: string;
                email: string;
                phone: string;
                totalPrice: string;
                confirm: string;
                cancel: string;
                bookingSuccess: string;
                bookingError: string;
            };
            catalog: string;
            contact: string;
            contactButton: string;
            contactCta: {
                title: string;
                description: string;
                cta: string;
            };
            contactInfo: string;
            destination: string;
            feature1: string;
            feature2: string;
            feature3: string;
            features: string;
            flightTypes: {
                title: string;
                subtitle: string;
                international: {
                    title: string;
                    description: string;
                };
                domestic: {
                    title: string;
                    description: string;
                };
                group: {
                    title: string;
                    description: string;
                };
                learnMore: string;
            };
            flights: {
                popular: {
                    newYork: string;
                    london: string;
                    paris: string;
                    tokyo: string;
                };
            };
            hero: {
                title: string;
                subtitle: string;
                description: string;
            };
            operator: string;
            origin: string;
            popularFlights: {
                title: string;
                subtitle: string;
            };
            price: string;
            results: {
                title: string;
                noResults: string;
                tryDifferentSearch: string;
                loadingFlights: string;
                flightsFound: string;
                airline: string;
                departure: string;
                arrival: string;
                duration: string;
                stops: string;
                price: string;
                action: string;
                bookNow: string;
                direct: string;
                oneStop: string;
                multipleStops: string;
            };
            route: string;
            search: {
                title: string;
                origin: string;
                originPlaceholder: string;
                destination: string;
                destinationPlaceholder: string;
                selectDate: string;
                passenger: string;
                passengersPlural: string;
                clear: string;
                departure: string;
                departurePlaceholder: string;
                arrival: string;
                arrivalPlaceholder: string;
                departureDate: string;
                returnDate: string;
                passengers: string;
                button: string;
                searching: string;
                roundTrip: string;
                oneWay: string;
            };
            title: string;
        };
        readonly voos: {
            hero: {
                titulo: string;
                subtitulo: string;
                cta: string;
            };
            pesquisa: {
                idaeVolta: string;
                soIda: string;
                tipoLabel: string;
                de: string;
                para: string;
                partida: string;
                regresso: string;
                passageirosLabel: string;
                passageiro_one: string;
                passageiro_other: string;
                procurar: string;
                aProcurar: string;
                incluirAeroportos: string;
                apenasDiretos: string;
                incluirHotel: string;
                selecionarOrigem: string;
                selecionarDestino: string;
            };
            caracteristicas: {
                titulo: string;
                subtitulo: string;
                badgeDestaque: string;
                coberturaGlobal: string;
                coberturaGlobalDesc: string;
                reservaSegura: string;
                reservaSeguraDesc: string;
                pagamentosFlexiveis: string;
                pagamentosFlexiveisDesc: string;
                suporte24h: string;
                suporte24hDesc: string;
                confortoBordo: string;
                confortoBordoDesc: string;
                bagagemGenerosa: string;
                bagagemGenerosaDesc: string;
                programaFidelidade: string;
                programaFidelidadeDesc: string;
                melhoresPrecos: string;
                melhoresPrecosDesc: string;
                saibaMais: string;
                pronto: string;
                botaoBuscar: string;
            };
            faq: {
                titulo: string;
                subtitulo: string;
                pergunta1: string;
                resposta1: string;
                pergunta2: string;
                resposta2: string;
                pergunta3: string;
                resposta3: string;
                pergunta4: string;
                resposta4: string;
            };
            resultados: {
                titulo: string;
                aeroportosProximos: string;
                apenasDiretos: string;
                direto: string;
                paragens: string;
                nenhumVoo: string;
                tentarNovamente: string;
                erroDuffel: string;
                classeEconomica: string;
                origem: string;
                destino: string;
                duracao: string;
                preco: string;
                porPassageiro: string;
                classificacao: string;
                selecionado: string;
                selecionar: string;
                opcoesHotel: string;
                aProcurarHoteis: string;
                nenhumHotel: string;
                reservarHotel: string;
                avaliacoes: string;
                porNoite: string;
                airlineFallback: string;
            };
            reserva: {
                confirmarTitulo: string;
                fechar: string;
                classeEconomica: string;
                origem: string;
                destino: string;
                duracao: string;
                passageirosLabel: string;
                passageiro_one: string;
                passageiro_other: string;
                tipoViagem: string;
                idaeVolta: string;
                sóIda: string;
                caracteristicas: string;
                precoTotal: string;
                cancelar: string;
                confirmar: string;
                aConfirmar: string;
            };
            page: {
                badge: string;
                benefits: {
                    secureBooking: string;
                    fastComparison: string;
                    dedicatedSupport: string;
                };
                searchShell: {
                    eyebrow: string;
                    title: string;
                    description: string;
                };
                openMaps: {
                    title: string;
                    description: string;
                };
            };
            duffel: {
                title: string;
                subtitle: string;
                searchResults: string;
                flightCardTitle: string;
                airlineFallback: string;
                totalPrice: string;
                directFlight: string;
                flightWithStops: string;
                aircraft: string;
                flightLabel: string;
                cabinClassSuffix: string;
                noFlightsFound: string;
                loading: string;
                errorTitle: string;
                notAvailable: string;
            };
        };
        readonly footer: {
            allRightsReserved: string;
            byTravelers: string;
            categories: {
                empresa: string;
                legal: string;
                ajuda: string;
                suporte: string;
                integrações: string;
            };
            company: {
                title: string;
                careers: string;
                press: string;
                sustainableTravel: string;
            };
            complaints: {
                title: string;
                tooltip: string;
                alt: string;
                entity: string;
            };
            cookies: string;
            description: string;
            followOn: string;
            guest: {
                title: string;
                smartForm: string;
                howItWorks: string;
            };
            ia: {
                preferences: string;
                toggle: string;
            };
            legalTitle: string;
            madeWith: string;
            newsletter: {
                title: string;
                description: string;
            };
            newsletterDescription: string;
            newsletterPlaceholder: string;
            newsletterPrivacy: string;
            newsletterSuccess: string;
            newsletterTitle: string;
            partnersDisclaimer: string;
            partnersTitle: string;
            partnerships: {
                title: string;
                gea: string;
                sanjotec: string;
                dg: string;
                turismodeportugal: string;
            };
            paymentMethods: string;
            paymentMethodsData: {
                transfer: string;
            };
            paymentMethodsTitle: string;
            privacy: string;
            product: {
                title: string;
                features: string;
                pricing: string;
                integrations: string;
                api: string;
                mobile: string;
            };
            quickLinksTitle: string;
            rightsReserved: string;
            securePayments: string;
            resources: {
                title: string;
            };
            services: {
                packages: string;
                hotels: string;
                flights: string;
                transfers: string;
                insurance: string;
            };
            servicesTitle: string;
            support: {
                title: string;
                help: string;
                documentation: string;
                status: string;
                community: string;
                technical: string;
                partnerships: string;
                howItWorks: string;
                integrations: string;
                app: string;
            };
            terms: string;
            user: {
                title: string;
                preferences: string;
                accountSettings: string;
                bookingHistory: string;
            };
            verifiedProvider: string;
            blogTitle: string;
        };
        readonly gallery: {
            cta_button: string;
            cta_description: string;
            cta_title: string;
            error_loading: string;
            items_shown: string;
            no_images_found: string;
            subtitle: string;
            title: string;
            viewItemAria: string;
        };
        readonly help: {
            documentation: string;
            actions: {
                helpful: string;
                yes: string;
                no: string;
                feedback: string;
                print: string;
                share: string;
            };
            hero: {
                title: string;
                subtitle: string;
            };
            sections: {
                search: {
                    placeholder: string;
                    button: string;
                    noResults: string;
                    tryDifferent: string;
                };
                categories: {
                    title: string;
                    gettingStarted: {
                        title: string;
                        description: string;
                    };
                    booking: {
                        title: string;
                        description: string;
                    };
                    account: {
                        title: string;
                        description: string;
                    };
                    payments: {
                        title: string;
                        description: string;
                    };
                    technical: {
                        title: string;
                        description: string;
                    };
                    policies: {
                        title: string;
                        description: string;
                    };
                };
                faq: {
                    title: string;
                    viewAll: string;
                    questions: {
                        howToBook: {
                            question: string;
                            answer: string;
                        };
                        cancelBooking: {
                            question: string;
                            answer: string;
                        };
                        paymentMethods: {
                            question: string;
                            answer: string;
                        };
                        refundPolicy: {
                            question: string;
                            answer: string;
                        };
                        changeBooking: {
                            question: string;
                            answer: string;
                        };
                        support: {
                            question: string;
                            answer: string;
                        };
                    };
                };
                contact: {
                    title: string;
                    description: string;
                    liveChat: string;
                    email: string;
                    phone: string;
                    hours: string;
                };
                tutorials: {
                    title: string;
                    description: string;
                    viewAll: string;
                };
            };
        };
        readonly home: {
            aiFeaturesItems: {
                recommendations: {
                    title: string;
                    desc: string;
                };
                planning: {
                    title: string;
                    desc: string;
                };
                personalization: {
                    title: string;
                    desc: string;
                };
            };
            cta: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                button: string;
                title: string;
                desc: string;
                aiBtn: string;
                aiSub: string;
                placeholder: string;
                btn: string;
                privacy: string;
                stats: {
                    subscribers: string;
                    offers: string;
                    countries: string;
                    satisfaction: string;
                };
            };
            destinations: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
            };
            featuredDestinations: {
                title: string;
                subtitle: string;
                viewAllDestinations: string;
                destinations: {
                    santorini: {
                        name: string;
                        description: string;
                        badge: string;
                        price: string;
                    };
                    tokyo: {
                        name: string;
                        description: string;
                        badge: string;
                        price: string;
                    };
                    bali: {
                        name: string;
                        description: string;
                        badge: string;
                        price: string;
                    };
                };
                reviews: string;
            };
            features: {
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                ctaLabel: string;
                guaranteedSecurity: {
                    title: string;
                    description: string;
                };
                specializedGuides: {
                    title: string;
                    description: string;
                };
                support247: {
                    title: string;
                    description: string;
                };
                bestPrices: {
                    title: string;
                    description: string;
                };
                easyBooking: {
                    title: string;
                    description: string;
                };
                curatedExperiences: {
                    title: string;
                    description: string;
                };
                cruises: {
                    title: string;
                    desc: string;
                    badge: string;
                };
                bus: {
                    title: string;
                    desc: string;
                    badge: null;
                };
                beach: {
                    title: string;
                    desc: string;
                    badge: null;
                };
                badge: {
                    popular: string;
                };
            };
            featuresAI: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                items: {
                    recommendations: {
                        title: string;
                        desc: string;
                    };
                    quickPlanning: {
                        title: string;
                        desc: string;
                    };
                    personalization: {
                        title: string;
                        desc: string;
                    };
                };
            };
            hero: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                ctaMain: string;
                ctaSecondary: string;
                exploreDestinations: string;
                learnMore: string;
            };
            heroAI: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                ctaStart: string;
                ctaDemo: string;
                loading: string;
                preparingDemo: string;
                stats: string[];
            };
            home: string;
            recommendations: {
                title: string;
                subtitle: string;
            };
            stats: {
                satisfiedClients: string;
                exclusiveDestinations: string;
                satisfactionRate: string;
                supportAvailable: string;
                destinations: string;
                partners: string;
                experience: string;
                customers: string;
            };
            statsLabels: {
                destinations: string;
                travelers: string;
                rating: string;
                support: string;
            };
            testimonials: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                ratingLabel: string;
            };
            testimonialsItems: {
                name: string;
                location: string;
                text: string;
            }[];
        };
        readonly hotels: {
            accommodationTypes: {
                title: string;
                description: string;
                learnMore: string;
                types: {
                    hotels: {
                        title: string;
                        description: string;
                        feature1: string;
                        feature2: string;
                    };
                    resorts: {
                        title: string;
                        description: string;
                        feature1: string;
                        feature2: string;
                    };
                    apartments: {
                        title: string;
                        description: string;
                        feature1: string;
                        feature2: string;
                    };
                    boutique: {
                        title: string;
                        description: string;
                        feature1: string;
                        feature2: string;
                    };
                };
            };
            bookingCta: {
                title: string;
                description: string;
                cta: string;
            };
            hero: {
                title: string;
                subtitle: string;
                cta: string;
            };
            destinations: {
                lisbon: string;
                porto: string;
                algarve: string;
                madrid: string;
            };
            popularDestinations: {
                title: string;
                subtitle: string;
                viewHotels: string;
                explorer: string;
                error: string;
            };
            ratings: {
                wonderful: string;
                veryGood: string;
                good: string;
                pleasant: string;
                average: string;
            };
            filters: {
                title: string;
                freeCancellation: string;
                payAtProperty: string;
                mealPlans: string;
                propertyType: string;
                sortBy: string;
                starRating: string;
                wonderful: string;
                veryGood: string;
                good: string;
                pleasant: string;
                clear: string;
                apply: string;
                activeFilters: string;
                noActiveFilters: string;
            };
            openMaps: {
                title: string;
                description: string;
            };
            search: {
                results: string;
                searching: string;
                hotelsFound: string;
                placeholder: string;
                tryAgain: string;
            };
            seo: {
                title: string;
                titleWithDestination: string;
                siteName: string;
                description: string;
                descriptionWithDestination: string;
            };
        };
        readonly insurance: {
            benefits: {
                badge: string;
                title: string;
                subtitle: string;
                learnMore: string;
                medical: {
                    title: string;
                    description: string;
                };
                cancellation: {
                    title: string;
                    description: string;
                };
                baggage: {
                    title: string;
                    description: string;
                };
                "247support": string;
                simpleProcess: string;
                priorityAssistance: string;
                specializedAssistance: string;
            };
            benefitsTitle: string;
            contact: {
                badge: string;
                title: string;
                subtitle: string;
            };
            contactCta: {
                title: string;
                description: string;
                cta: string;
            };
            coverage: {
                badge: string;
                title: string;
                subtitle: string;
                selectPlan: string;
            };
            coveragesTitle: string;
            detailedCoverages: string;
            faq: {
                title: string;
                subtitle: string;
                q1: string;
                a1: string;
                q2: string;
                a2: string;
                q3: string;
                a3: string;
            };
            features: {
                medicalExpenses: string;
                personalAccidents: string;
                luggageLoss: string;
                flightCancellation: string;
                tripInterruption: string;
                personalLiability: string;
                extremeSports: string;
                searchAndRescue: string;
                childCareAssistance: string;
                familyPackageDiscounts: string;
            };
            finePrint: string;
            generalBenefits: string;
            getQuoteButton: string;
            hero: {
                title: string;
                subtitle: string;
                cta: string;
            };
            products: {
                title: string;
                subtitle: string;
                basic: {
                    name: string;
                    description: string;
                    summary: string;
                    price: string;
                    finePrint: string;
                };
                premium: {
                    name: string;
                    description: string;
                    summary: string;
                    price: string;
                    badge: string;
                    finePrint: string;
                };
                adventure: {
                    name: string;
                    description: string;
                    summary: string;
                    price: string;
                    finePrint: string;
                };
                family: {
                    name: string;
                    description: string;
                    summary: string;
                    price: string;
                    finePrint: string;
                };
            };
            viewDetails: string;
            whyChooseUs: {
                title: string;
                subtitle: string;
                badge: string;
                feature1_title: string;
                feature1_desc: string;
                feature2_title: string;
                feature2_desc: string;
                feature3_title: string;
                feature3_desc: string;
            };
        };
        readonly language: {
            current: string;
            select: string;
        };
        readonly legal: {
            terms: string;
            privacy: string;
            cookies: string;
            gdpr: string;
            cancellation: string;
            cancellationPage: {
                title: string;
                subtitle: string;
                ui: {
                    loading: string;
                    refundTimeline: {
                        title: string;
                        description: string;
                    };
                    howToHint: string;
                };
                sections: {
                    id: string;
                    title: string;
                    content: string[];
                }[];
            };
            cookiesPage: {
                title: string;
                ui: {
                    readingProgressAria: string;
                    privacyCenterBadge: string;
                    aboutThisPolicy: string;
                };
                sections: {
                    title: string;
                    content: string[];
                }[];
            };
            gdprPage: {
                hero: {
                    title: string;
                    subtitle: string;
                };
                lastUpdated: string;
                ui: {
                    compliantBadge: string;
                    lastUpdated: string;
                    navigationTitle: string;
                    quickActionsTitle: string;
                    contactDpo: string;
                    exerciseRights: string;
                    nav: {
                        introduction: string;
                        dataCategories: string;
                        dataController: string;
                        dataProcessing: string;
                        dataTypes: string;
                        userRights: string;
                        dataSecurity: string;
                        contact: string;
                    };
                };
                intro: string;
                sections: {
                    dataController: {
                        title: string;
                        content: string;
                        contact: {
                            name: string;
                            email: string;
                            phone: string;
                            address: string;
                        };
                    };
                    dataProcessing: {
                        title: string;
                        purposes: {
                            title: string;
                            description: string;
                            legalBasis: string;
                        }[];
                    };
                    rights: {
                        title: string;
                        description: string;
                        list: {
                            title: string;
                            description: string;
                        }[];
                    };
                    dataSecurity: {
                        title: string;
                        content: string;
                    };
                    dataTransfer: {
                        title: string;
                        content: string;
                    };
                    retention: {
                        title: string;
                        content: string;
                    };
                    complaints: {
                        title: string;
                        content: string;
                    };
                };
            };
            hero: {
                title: string;
                lastUpdated: string;
                terms: string;
                privacy: string;
                cookies: string;
                cancellation: string;
            };
            privacyPage: {
                title: string;
                ui: {
                    badge: string;
                    updatedLabel: string;
                    applicableLabel: string;
                    printVersion: {
                        title: string;
                        description: string;
                        download: string;
                    };
                    intro: string;
                    contactDpo: string;
                    backToTopAria: string;
                };
                introduction: {
                    title: string;
                    content: string[];
                };
                sections: {
                    title: string;
                    content: string[];
                }[];
            };
            sections: string;
            termsPage: {
                title: string;
                introduction: {
                    title: string;
                    content: string[];
                };
                sections: {
                    title: string;
                    content: string[];
                }[];
            };
            title: string;
        };
        readonly loading: {
            loading: {
                admin: string;
                user: string;
                default: string;
                publicPage: string;
                adminDashboard: string;
                userDashboard: string;
                auth: string;
            };
        };
        readonly localGuides: {
            becomeGuide: {
                title: string;
                description: string;
                applyNow: string;
                feature1: {
                    title: string;
                    desc: string;
                };
                feature2: {
                    title: string;
                    desc: string;
                };
                feature3: {
                    title: string;
                    desc: string;
                };
            };
            detailsPanel: {
                about: string;
                tours: string;
                moreInfo: string;
                memberSince: string;
                bookTour: string;
                noTours: string;
                languages: string;
                specialties: string;
                experienceYears: string;
                certifications: string;
                basePrice: string;
                hour: string;
                contactGuideCta: string;
            };
            filters: {
                title: string;
                clear: string;
                searchLabel: string;
                searchPlaceholder: string;
                locationLabel: string;
                allLocations: string;
                specialtyLabel: string;
                allSpecialties: string;
                languageLabel: string;
                allLanguages: string;
            };
            guides: {
                guide_1: {
                    bio: string;
                    tagline: string;
                    tour_title: string;
                    tour_desc: string;
                };
                guide_2: {
                    bio: string;
                    tagline: string;
                    tour_title: string;
                    tour_desc: string;
                };
            };
            guidesList: {
                title: string;
                sortBy: string;
                sortOptions: {
                    rating: string;
                    name: string;
                    experience: string;
                    price: string;
                };
                verified: string;
                reviews_one: string;
                reviews_other: string;
                experience_one: string;
                experience_other: string;
                viewProfile: string;
                noResultsTitle: string;
                noResultsDesc: string;
            };
            hero: {
                badge: string;
                title: string;
                subtitle: string;
            };
            specialties: {
                histoire: string;
                gastronomie: string;
                nature: string;
                architecture: string;
            };
            page: {
                titlePrefix: string;
                titleHighlight: string;
                loadingExperts: string;
                guidesAvailable: string;
                emptyState: {
                    title: string;
                    description: string;
                    clearAll: string;
                };
                cta: {
                    title: string;
                    subtitle: string;
                    primary: string;
                    secondary: string;
                };
            };
        };
        readonly mobile: {
            app: {
                app: string;
            };
            cta: {
                title: string;
                subtitle: string;
                ios: string;
                android: string;
            };
            features: {
                title: string;
                subtitle: string;
                offlineMaps: {
                    title: string;
                    desc: string;
                };
                pushNotifications: {
                    title: string;
                    desc: string;
                };
                offlineSync: {
                    title: string;
                    desc: string;
                };
                cameraIntegration: {
                    title: string;
                    desc: string;
                };
                gpsNavigation: {
                    title: string;
                    desc: string;
                };
                secureStorage: {
                    title: string;
                    desc: string;
                };
            };
            hero: {
                appLabel: string;
                appStore: string;
                googlePlay: string;
            };
            reviews: {
                title: string;
                subtitle: string;
                maria: {
                    comment: string;
                };
                joao: {
                    comment: string;
                };
                ana: {
                    comment: string;
                };
            };
            screenshots: {
                title: string;
                subtitle: string;
                explore: {
                    title: string;
                    desc: string;
                };
                plan: {
                    title: string;
                    desc: string;
                };
                book: {
                    title: string;
                    desc: string;
                };
            };
            stats: {
                downloads: string;
                rating: string;
                activeUsers: string;
                countries: string;
            };
        };
        readonly nav: {
            about: string;
            accessibility: {
                skipToContent: string;
                contrast: string;
                fontSize: string;
            };
            activities: string;
            auth: {
                login: string;
                register: string;
            };
            blog: string;
            blogMenu: {
                allPosts: string;
                sustainableTravel: string;
            };
            booking: string;
            common: {
                toggleMenu: string;
                logout: string;
            };
            community: string;
            contact: string;
            cruzeiros: string;
            cruises: string;
            currency: {
                eur: string;
                usd: string;
                gbp: string;
            };
            demo: string;
            destinations: string;
            faq: string;
            flights: string;
            gallery: string;
            goToHome: string;
            home: string;
            hotels: string;
            integrations: string;
            language: {
                en: string;
                fr: string;
                es: string;
                pt: string;
                label: string;
            };
            legal: {
                terms: string;
                privacy: string;
                cookies: string;
                accessibility: string;
            };
            login: string;
            map: string;
            menu: string;
            mobileNavigation: string;
            bottom_nav: string;
            dashboard: string;
            trips: string;
            bookings: string;
            profile: string;
            searchPlaceholder: string;
            quickActions: string;
            newTrip: string;
            newBooking: string;
            support: string;
            notifications: string;
            newBookingConfirmed: string;
            bookingConfirmedForLisbon: string;
            myProfile: string;
            settings: string;
            billing: string;
            help: string;
            search: string;
            account: string;
            openMenu: string;
            packages: string;
            planYourTrip: string;
            poweredByAI: string;
            preferences: string;
            register: string;
            rent_a_car: string;
            services: string;
            servicesList: {
                packages: string;
                hotels: string;
                flights: string;
                transfers: string;
                cruises: string;
                localGuides: string;
                insurance: string;
                all: string;
                ferries: string;
                trains: string;
                rent_a_car: string;
                buses: string;
                activities: string;
            };
            smartForm: string;
            sustainable: string;
            user: {
                profile: string;
                trips: string;
                wishlist: string;
                settings: string;
            };
            userMenu: {
                profile: string;
                settings: string;
                dashboard: string;
                logout: string;
                billing: string;
                help: string;
            };
            userNavigation: {
                dashboard: string;
                trips: string;
                bookings: string;
                profile: string;
                payments: string;
                settings: string;
            };
        };
        readonly newsletter: {
            newsletter: {
                description: string;
                emailLabel: string;
                emailPlaceholder: string;
                subscribeButton: string;
                title: string;
            };
        };
        readonly notifications: {
            empty: string;
            error: string;
            info: string;
            markAll: string;
            success: string;
            title: string;
            toggle: string;
            unread: string;
            urgent: string;
            viewAll: string;
            warning: string;
        };
        readonly packages: {
            customCta: {
                title: string;
                description: string;
                cta: string;
            };
            hero: {
                title: string;
                subtitle: string;
                cta: string;
                viewDeals: string;
            };
            packageTypes: {
                title: string;
                description: string;
                explore: string;
                romantic: {
                    title: string;
                    description: string;
                    feature1: string;
                    feature2: string;
                };
                family: {
                    title: string;
                    description: string;
                    feature1: string;
                    feature2: string;
                };
                adventure: {
                    title: string;
                    description: string;
                    feature1: string;
                    feature2: string;
                };
                gastronomic: {
                    title: string;
                    description: string;
                    feature1: string;
                    feature2: string;
                };
                luxury: {
                    title: string;
                    description: string;
                };
                wellness: {
                    title: string;
                    description: string;
                };
                "group-travel": {
                    title: string;
                    description: string;
                };
                "cultural-exchange": {
                    title: string;
                    description: string;
                };
                "photography-tourism": {
                    title: string;
                    description: string;
                };
                "snow-sports": {
                    title: string;
                    description: string;
                };
                "corporate-travel": {
                    title: string;
                    description: string;
                };
                "coastal-tourism": {
                    title: string;
                    description: string;
                };
            };
            personalized: {
                title: string;
                description: string;
                learnMore: string;
            };
            featuredPackages: {
                title: string;
            };
            page: {
                hero: {
                    title: string;
                    subtitle: string;
                };
                error: {
                    title: string;
                    message: string;
                    retry: string;
                };
                empty: {
                    title: string;
                    message: string;
                };
                unknown: string;
                onRequest: string;
                brand: string;
                featured: string;
                categoryBanner: {
                    title: string;
                    subtitle: string;
                    cta: string;
                };
                stats: {
                    packages: string;
                    destinations: string;
                    categories: string;
                    averageRating: string;
                    na: string;
                };
                schema: {
                    collectionName: string;
                    collectionDescription: string;
                    breadcrumbHome: string;
                    breadcrumbPackages: string;
                    organizationName: string;
                    organizationDescription: string;
                };
            };
        };
        readonly payments: {
            actions: {
                menu: string;
                options: string;
                configure: string;
                viewProvider: string;
                activate: string;
                deactivate: string;
                delete: string;
                clickToActivate: string;
                clickToDeactivate: string;
            };
            addMethod: string;
            currency: {
                free: string;
            };
            description: string;
            dialog: {
                addTitle: string;
                editTitle: string;
                addDescription: string;
                editDescription: string;
                fields: {
                    methodName: string;
                    methodNamePlaceholder: string;
                    provider: string;
                    providerPlaceholder: string;
                    feesDescription: string;
                    feesPlaceholder: string;
                    activeMethod: string;
                };
                buttons: {
                    cancel: string;
                    saving: string;
                    saveChanges: string;
                    addMethod: string;
                };
            };
            messages: {
                methodsLoaded: string;
                loadError: string;
                loadErrorDescription: string;
                validationError: string;
                nameRequired: string;
                updateSuccess: string;
                methodUpdated: string;
                methodAdded: string;
                saveError: string;
                saveErrorDescription: string;
                statusUpdated: string;
                statusUpdateError: string;
                deleteConfirm: string;
                methodDeleted: string;
                deleteError: string;
            };
            stats: {
                activeMethods: string;
                activeMethodsDescription: string;
                averageFee: string;
                averageFeeDescription: string;
                mostPopular: string;
                mostPopularValue: string;
                mostPopularDescription: string;
                nextReview: string;
                nextReviewValue: string;
                nextReviewDescription: string;
            };
            status: {
                ativo: string;
                inativo: string;
                em_configuracao: string;
            };
            table: {
                title: string;
                description: string;
                searchPlaceholder: string;
                tabs: {
                    all: string;
                    active: string;
                    inactive: string;
                };
                headers: {
                    name: string;
                    provider: string;
                    status: string;
                    fees: string;
                    availableIn: string;
                    lastUpdated: string;
                    actions: string;
                };
                noMethods: string;
                global: string;
            };
            title: string;
        };
        readonly preferences: {
            activities: {
                beaches: string;
                adventure: string;
                culture: string;
                gastronomy: string;
                nightlife: string;
                nature: string;
                photography: string;
                shopping: string;
                wellness: string;
            };
            budget: string;
            budgetOptions: {
                select: string;
                "500-1000": string;
                "1000-3000": string;
                "3000-5000": string;
                "5000+": string;
            };
            comments: string;
            departureDate: string;
            destination: string;
            destinations: {
                europe: string;
                asia: string;
                northAmerica: string;
                southAmerica: string;
                africa: string;
                oceania: string;
                caribbean: string;
                middleEast: string;
            };
            duration: string;
            durationOptions: {
                select: string;
                weekend: string;
                week: string;
                "2weeks": string;
                month: string;
            };
            email: string;
            errorGeneratingTrip: string;
            errorSavingFeedback: string;
            feedbackSaved: string;
            generateTrip: string;
            generating: string;
            interests: string;
            interestsEnum: {
                ADVENTURE: string;
                CULTURE: string;
                RELAXATION: string;
                NATURE: string;
                GASTRONOMY: string;
            };
            itinerary: string;
            name: string;
            nextMonth: string;
            nextQuarter: string;
            nextWeek: string;
            placeholders: {
                groupSize: string;
                dietary: string;
                specialRequests: string;
            };
            planningSection: string;
            provideFeedback: string;
            quickSelection: string;
            rating: string;
            returnDate: string;
            selectDepartureDate: string;
            selectInterest: string;
            selectReturnDate: string;
            selectSustainability: string;
            submit: string;
            submitFeedback: string;
            submitting: string;
            subtitle: string;
            success: string;
            successDescription: string;
            sustainability: string;
            sustainabilityEnum: {
                LOW: string;
                MEDIUM: string;
                HIGH: string;
            };
            title: string;
            travelDates: string;
            travelStyles: {
                luxury: string;
                adventure: string;
                budget: string;
            };
            travelers: string;
            tripGenerated: string;
            validation: {
                nameRequired: string;
                emailInvalid: string;
                budgetPositive: string;
                durationPositive: string;
                travelersMin: string;
            };
            yourTripProposal: string;
        };
        readonly press: {
            awards: {
                title: string;
                noAwards: string;
            };
            hero: {
                title: string;
                subtitle: string;
            };
            resources: {
                title: string;
                brandGuidelines: string;
                logos: string;
                screenshots: string;
                videos: string;
                presentations: string;
            };
            sections: {
                about: {
                    title: string;
                    description: string;
                };
                newsReleases: {
                    title: string;
                    noReleases: string;
                    viewAll: string;
                };
                mediaKit: {
                    title: string;
                    description: string;
                    downloadButton: string;
                };
                contact: {
                    title: string;
                    description: string;
                    email: string;
                    phone: string;
                    contactButton: string;
                };
                facts: {
                    title: string;
                    founded: string;
                    headquarters: string;
                    employees: string;
                    users: string;
                    countries: string;
                };
                leadership: {
                    title: string;
                    ceo: string;
                    cto: string;
                    cmo: string;
                };
            };
            timeline: {
                title: string;
                milestones: string;
            };
        };
        readonly pricing: {
            billing: {
                monthly: string;
                annually: string;
                toggleAriaLabel: string;
                defaultSave: string;
                perYearShort: string;
                perMonthShort: string;
            };
            choosePlan: {
                title: string;
                description: string;
            };
            faq: {
                title: string;
                description: string;
                q1: {
                    title: string;
                    description: string;
                };
                q2: {
                    title: string;
                    description: string;
                };
                q3: {
                    title: string;
                    description: string;
                };
                q4: {
                    title: string;
                    description: string;
                };
                q5: {
                    title: string;
                    description: string;
                    linkText: string;
                };
            };
            free: string;
            hero: {
                title: string;
                subtitle: string;
            };
            plans: {
                mostPopular: string;
                popularBadge: string;
                bonusFeature: string;
                basic: {
                    name: string;
                    description: string;
                    cta: string;
                    feature1: string;
                    feature2: string;
                    feature3: string;
                    feature4: string;
                    feature4Tooltip: string;
                };
                premium: {
                    name: string;
                    description: string;
                    cta: string;
                    annualSave: string;
                    feature1: string;
                    feature2: string;
                    feature3: string;
                    feature3Tooltip: string;
                    feature4: string;
                    feature5: string;
                    feature6: string;
                };
                business: {
                    name: string;
                    description: string;
                    cta: string;
                    priceSuffix: string;
                    annualSave: string;
                    feature1: string;
                    feature2: string;
                    feature3: string;
                    feature4: string;
                    feature5: string;
                    feature5Tooltip: string;
                    feature6: string;
                    feature7: string;
                };
            };
        };
        readonly profile: {
            account: {
                title: string;
                delete_account: string;
                delete_confirm: string;
                account_deleted: string;
            };
            admin: {
                dashboard: string;
                users: string;
                settings: {
                    title: string;
                };
                blog: string;
                sustainable_travel: string;
            };
            complete: string;
            completeness: string;
            contact: string;
            description: string;
            edit: string;
            info_updated: string;
            logout: string;
            payment: string;
            personal: string;
            personal_data: {
                title: string;
                description: string;
                first_name: string;
                last_name: string;
                email: string;
                phone: string;
                date_of_birth: string;
                nationality: string;
                tax_id: string;
                gender: string;
                gender_female: string;
                gender_male: string;
                marital_status: string;
                marital_status_married: string;
                marital_status_single: string;
                address: string;
                address_description: string;
                street: string;
                number: string;
                complement: string;
                neighborhood: string;
                city: string;
                state: string;
                postal_code: string;
                country: string;
                travel_preferences_description: string;
                preferred_currency: string;
                euro: string;
                us_dollar: string;
                british_pound: string;
                brazilian_real: string;
                preferred_language: string;
                portuguese: string;
                english: string;
                spanish: string;
                french: string;
                payment_methods: string;
                payment_methods_description: string;
                no_payment_methods: string;
                add_payment_method: string;
                add_payment_method_button: string;
                privacy_settings_description: string;
                profile_visibility: string;
                show_email: string;
                show_email_description: string;
                show_phone: string;
                show_phone_description: string;
                show_address: string;
                show_address_description: string;
                marketing_emails: string;
                marketing_emails_description: string;
                sms_notifications: string;
                sms_notifications_description: string;
                push_notifications: string;
                push_notifications_description: string;
                data_sharing_title: string;
                share_with_partners: string;
                share_with_partners_description: string;
            };
            preferences: string;
            privacy: string;
            save_changes: string;
            security: {
                title: string;
                current_password: string;
                new_password: string;
                confirm_new_password: string;
                change_password: string;
                passwords_dont_match: string;
                password_updated: string;
                invalid_password: string;
            };
            title: string;
            unexpected_error: string;
            verification: {
                email_verified: string;
                phone_not_verified: string;
            };
        };
        readonly profilepreferences: {
            budget: string;
            duration: string;
            group_size: string;
            payment_methods: string;
            preferred_currency: string;
            preferred_language: string;
            select_budget: string;
            select_duration: string;
            select_payment_method: string;
            title: string;
            travel_preferences: string;
        };
        readonly register: {
            account_created_success: string;
            already_have_account: string;
            confirm_password: string;
            confirm_your_password: string;
            continue_with_facebook: string;
            continue_with_google: string;
            create_account: string;
            create_account_button: string;
            create_password: string;
            creating_account: string;
            email: string;
            error_creating_account: string;
            fill_required_fields: string;
            first_name: string;
            form: {
                accept_terms: string;
                accept_privacy: string;
                accept_cookies: string;
                newsletter: string;
                terms_of_service: string;
                privacy_policy: string;
                cookie_policy: string;
            };
            last_name: string;
            login_link: string;
            medium: string;
            or: string;
            password: string;
            password_strength: string;
            passwords_dont_match: string;
            phone: string;
            required_field: string;
            strong: string;
            subtitle: string;
            title: string;
            unexpected_error: string;
            weak: string;
        };
        readonly rentacar: {
            action: string;
            any: string;
            availableCars: string;
            availableNow: string;
            bookNow: string;
            carType: string;
            carsFound: string;
            contactInfo: string;
            contactSupport: string;
            endDate: string;
            feature1: string;
            feature2: string;
            feature3: string;
            image: string;
            location: string;
            locations: string;
            maxPrice: string;
            model: string;
            needHelp: string;
            price: string;
            pricePerDay: string;
            quickStats: string;
            search: string;
            searchAndBook: string;
            searchModel: string;
            searchPlaceholder: string;
            startDate: string;
            subtitle: string;
            titlePart1: string;
            titlePart2: string;
            totalCars: string;
            totalPrice: string;
            whyChooseUs: string;
        };
        readonly search: {
            filters: {
                title: string;
                clear: string;
                type: {
                    title: string;
                    destinations: string;
                    hotels: string;
                    packages: string;
                    attractions: string;
                    restaurants: string;
                };
                price: {
                    title: string;
                };
                rating: {
                    title: string;
                    any: string;
                };
            };
            header: {
                exploreOffers: string;
            };
            results: {
                count: string;
                featured: string;
                types: {
                    destination: string;
                    transfer: string;
                    restaurant: string;
                    cruise: string;
                    attraction: string;
                    package: string;
                    hotel: string;
                    flight: string;
                };
                reviews: string;
                noReviews: string;
                perWhat: {
                    vehicle: string;
                    experience: string;
                    guest: string;
                    person: string;
                    night: string;
                };
                viewDetails: string;
            };
            sort: {
                placeholder: string;
                relevance: string;
                priceLow: string;
                priceHigh: string;
                ratingHigh: string;
                nameAZ: string;
            };
            view: {
                list: string;
                map: string;
            };
        };
        readonly services: {
            benefits: {
                title: string;
                subtitle: string;
                items: string[];
            };
            cta: {
                title: string;
                subtitle: string;
                buttons: {
                    quote: string;
                    destinations: string;
                };
            };
            hero: {
                badge: string;
                title: string;
                subtitle: string;
            };
            mainServices: {
                title: string;
                subtitle: string;
                popularBadge: string;
                ctaButton: string;
                items: {
                    packages: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    flights: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    hotels: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    transfers: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    cruises: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    localGuides: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    insurance: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                };
            };
            process: {
                title: string;
                subtitle: string;
                items: {
                    step1: {
                        title: string;
                        description: string;
                    };
                    step2: {
                        title: string;
                        description: string;
                    };
                    step3: {
                        title: string;
                        description: string;
                    };
                    step4: {
                        title: string;
                        description: string;
                    };
                };
            };
            specializedServices: {
                title: string;
                subtitle: string;
                ctaButton: string;
                items: {
                    honeymoon: {
                        title: string;
                        description: string;
                    };
                    groupTravel: {
                        title: string;
                        description: string;
                    };
                    culturalExchange: {
                        title: string;
                        description: string;
                    };
                    photoTourism: {
                        title: string;
                        description: string;
                    };
                };
            };
        };
        readonly settings: {
            settings: {
                title: string;
                subtitle: string;
                notifications: string;
                notificationsDescription: string;
                disable: string;
                enable: string;
                language: string;
                languageDescription: string;
                dangerZone: string;
                dangerZoneDescription: string;
                deleteAccount: string;
                notificationTypes: {
                    email: string;
                    push: string;
                    sms: string;
                };
                notificationDescriptions: {
                    email: string;
                    push: string;
                    sms: string;
                };
            };
        };
        readonly 'smart-form': {
            basics: {
                header: {
                    title: string;
                    subtitle: string;
                };
                completion: {
                    allDone: string;
                    progress: string;
                };
                aria: {
                    progressBar: string;
                    done: string;
                    pending: string;
                    stepStatus: string;
                };
                groups: {
                    whereWhen: {
                        label: string;
                        description: string;
                    };
                    whoHow: {
                        label: string;
                        description: string;
                    };
                    travelType: {
                        label: string;
                        description: string;
                    };
                };
                sections: {
                    destination: {
                        title: string;
                        subtitle: string;
                    };
                    dates: {
                        title: string;
                        subtitle: string;
                    };
                    travelers: {
                        title: string;
                        subtitle: string;
                    };
                    language: {
                        title: string;
                        subtitle: string;
                    };
                };
            };
            budget: {
                header: {
                    title: string;
                    subtitle: string;
                };
                categories: {
                    accommodation: string;
                    food: string;
                    activities: string;
                    transport: string;
                    shopping: string;
                    emergency: string;
                    travelInsurance: string;
                };
                settings: {
                    title: string;
                    subtitle: string;
                    currency: string;
                    durationDays: string;
                };
                savings: {
                    title: string;
                    subtitle: string;
                    amount: string;
                    progress: string;
                    savedOf: string;
                    total: string;
                };
                tips: {
                    title: string;
                    subtitle: string;
                    emergencyBuffer: {
                        title: string;
                        body: string;
                    };
                    dailySpending: {
                        title: string;
                        body: string;
                        bodyWithSuggestion: string;
                    };
                    savingsStrategy: {
                        title: string;
                        good: string;
                        improve: string;
                    };
                };
                overview: {
                    totalBudget: {
                        label: string;
                        perDay: string;
                    };
                    savingsGoal: {
                        label: string;
                        percentOfTotal: string;
                    };
                    tripDuration: {
                        label: string;
                        value: string;
                        extended: string;
                        short: string;
                    };
                };
                aria: {
                    sidebar: string;
                };
            };
            personalization: {
                title: string;
                description: string;
                banner: {
                    noPreferences: string;
                    noActivities: string;
                    ready: string;
                    count: string;
                };
                sections: {
                    travelPreferences: {
                        title: string;
                        subtitle: string;
                    };
                    activities: {
                        title: string;
                        subtitle: string;
                    };
                };
            };
        };
        readonly support: {
            agents: {
                title: string;
                subtitle: string;
                rating: string;
                responseTime: string;
                specialties: string;
                languages: string;
                startChat: string;
                offline: string;
                online: string;
            };
            articles: {
                title: string;
                subtitle: string;
                readTime: string;
                views: string;
                updated: string;
                readArticle: string;
                difficulty: {
                    beginner: string;
                    intermediate: string;
                    advanced: string;
                };
            };
            channels: {
                title: string;
                subtitle: string;
                liveChat: string;
                email: string;
                phone: string;
                videoCall: string;
                contact: string;
                unavailable: string;
                availability: string;
                responseTime: string;
                languages: string;
            };
            common: {
                loading: string;
                error: string;
                success: string;
                cancel: string;
                save: string;
                close: string;
                back: string;
                next: string;
                previous: string;
            };
            emergency: {
                title: string;
                subtitle: string;
                phone: string;
                emergencyChat: string;
            };
            faq: {
                title: string;
                subtitle: string;
                helpful: string;
                views: string;
                viewMore: string;
                categories: {
                    all: string;
                    bookings: string;
                    api: string;
                    payments: string;
                    account: string;
                    mobile: string;
                    security: string;
                };
            };
            hero: {
                title: string;
                subtitle: string;
            };
            search: {
                placeholder: string;
                noResults: string;
                resultsFound: string;
            };
            stats: {
                avgResponseTime: string;
                satisfactionRate: string;
                articlesAvailable: string;
                supportAgents: string;
            };
            tabs: {
                faq: string;
                articles: string;
                ticket: string;
                agents: string;
            };
            ticket: {
                title: string;
                subtitle: string;
                form: {
                    name: string;
                    email: string;
                    subject: string;
                    category: string;
                    priority: string;
                    description: string;
                    attachments: string;
                    submit: string;
                    submitting: string;
                    selectCategory: string;
                    selectPriority: string;
                    dragFiles: string;
                    maxFiles: string;
                };
                categories: {
                    technical: string;
                    billing: string;
                    account: string;
                    feature: string;
                    other: string;
                };
                priorities: {
                    low: string;
                    medium: string;
                    high: string;
                    urgent: string;
                };
            };
        };
        readonly sustainable: {
            articles: {
                readMore: string;
            };
            page: {
                hero: {
                    title: string;
                    subtitle: string;
                };
                commitment: {
                    title: string;
                    subtitle: string;
                    pillars: {
                        icon: string;
                        title: string;
                        description: string;
                        colorClass: string;
                    }[];
                };
                practices: {
                    title: string;
                    subtitle: string;
                    items: {
                        id: string;
                        icon: string;
                        title: string;
                        description: string;
                        points: string[];
                    }[];
                };
                articles: {
                    title: string;
                    subtitle: string;
                    items: {
                        title: string;
                        excerpt: string;
                        image: string;
                        category: string;
                        date: string;
                        slug: string;
                    }[];
                    readMore: string;
                    cta: string;
                };
                joinMovement: {
                    title: string;
                    description: string;
                    mainCta: string;
                    secondaryCta: string;
                };
                callToAction: string;
            };
        };
        readonly terms: {
            responsibility: {
                title: string;
                subtitle: string;
                lastUpdated: string;
                effectiveDate: string;
                introduction: string;
                sections: {
                    liability: {
                        title: string;
                        intro: string;
                        scope: string;
                        exclusions: string[];
                    };
                    client: {
                        title: string;
                        intro: string;
                        items: string[];
                    };
                    company: {
                        title: string;
                        intro: string;
                        items: string[];
                    };
                    insurance: {
                        title: string;
                        intro: string;
                        coverage: string[];
                        company: string;
                    };
                    disputes: {
                        title: string;
                        intro: string;
                        procedure: string[];
                        jurisdiction: string;
                    };
                };
            };
            error: {
                title: string;
                message: string;
                retry: string;
            };
            terms: {
                lastUpdated: string;
                effective: string;
                version: string;
                download: string;
                print: string;
            };
            footer: {
                newsletter: {
                    title: string;
                    description: string;
                    placeholder: string;
                    success: string;
                    error: string;
                };
                contact: {
                    title: string;
                };
                legal: {
                    title: string;
                };
                compliance: {
                    title: string;
                };
                governed: string;
                questions: string;
                rights: string;
                secure: string;
                verified: string;
                transparent: string;
            };
        };
        readonly testimonials: {
            listTitle: string;
            quotePrefix: string;
            quoteSuffix: string;
            rating: string;
            subtitle: string;
            title: string;
            feedbackLabel: string;
            noReviews: string;
            totalReviews: string;
            averageRating: string;
            verified: string;
            featured: string;
            fallback: {
                comments: string[];
                trips: string[];
            };
        };
        readonly theme: {
            accessibility: {
                themeToggle: string;
                currentTheme: string;
                themeMenu: string;
                closeMenu: string;
            };
            adminDark: string;
            adminLight: string;
            auto: string;
            autoActive: string;
            current: string;
            dark: string;
            interfaceTitle: string;
            light: string;
            moreOptions: string;
            nightSchedule: string;
            settings: {
                title: string;
                description: string;
                autoMode: string;
                autoModeDescription: string;
                manualMode: string;
                manualModeDescription: string;
            };
            simpleMode: string;
            toggleAria: string;
            toggleTitle: string;
            userDark: string;
            userLight: string;
        };
        readonly transfer: {
            bookingForm: {
                title: string;
                description: string;
                from: string;
                from_placeholder: string;
                to: string;
                to_placeholder: string;
                button: string;
            };
            cta: {
                title: string;
                description: string;
                button: string;
            };
            fleet: {
                title: string;
                subtitle: string;
                vehicle: {
                    sedan: string;
                    sedan_desc: string;
                    executive: string;
                    executive_desc: string;
                    van: string;
                    van_desc: string;
                };
            };
            hero: {
                title: string;
                subtitle: string;
            };
            howItWorks: {
                title: string;
                subtitle: string;
                step1_title: string;
                step1_desc: string;
                step2_title: string;
                step2_desc: string;
                step3_title: string;
                step3_desc: string;
            };
        };
        readonly transfers: {
            bookingForm: {
                title: string;
                description: string;
                from: string;
                from_placeholder: string;
                to: string;
                to_placeholder: string;
                button: string;
            };
            cta: {
                title: string;
                description: string;
                button: string;
            };
            fleet: {
                title: string;
                subtitle: string;
                vehicle: {
                    sedan: string;
                    sedan_desc: string;
                    executive: string;
                    executive_desc: string;
                    van: string;
                    van_desc: string;
                };
            };
            hero: {
                title: string;
                subtitle: string;
            };
            howItWorks: {
                title: string;
                subtitle: string;
                step1: {
                    title: string;
                    description: string;
                };
                step2: {
                    title: string;
                    description: string;
                };
                step3: {
                    title: string;
                    description: string;
                };
            };
            toast: {
                noResultsTitle: string;
                description: string;
            };
        };
        readonly 'traveler-profile': {
            profile: {
                title: string;
                completeness: {
                    title: string;
                    complete: string;
                    incomplete: string;
                    progress: string;
                    completeItem: string;
                    items: {
                        profile_photo: string;
                        phone: string;
                        documents: string;
                        emergency_contact: string;
                        ai_preferences: string;
                        travel_preferences: string;
                        payment_methods: string;
                        address: string;
                    };
                };
            };
            documents: {
                title: string;
                subtitle: string;
                add: string;
                addTitle: string;
                addDescription: string;
                noDocuments: string;
                fields: {
                    type: string;
                    number: string;
                    issueDate: string;
                    expiryDate: string;
                    issuer: string;
                };
                types: {
                    passport: string;
                    national_id: string;
                    visa: string;
                    drivers_license: string;
                    travel_pass: string;
                };
                status: {
                    valid: string;
                    expiring_soon: string;
                    expired: string;
                    needs_verification: string;
                };
                verified: string;
                issued: string;
                expires: string;
                expiresIn: string;
                upload: string;
                delete: string;
            };
            emergencyContact: {
                title: string;
                subtitle: string;
                add: string;
                addTitle: string;
                addDescription: string;
                noContacts: string;
                fields: {
                    name: string;
                    relationship: string;
                    phone: string;
                    email: string;
                };
                relationships: {
                    spouse: string;
                    parent: string;
                    sibling: string;
                    child: string;
                    friend: string;
                    other: string;
                };
                primary: string;
                delete: string;
            };
            stats: {
                title: string;
                subtitle: string;
                totalTrips: string;
                countries: string;
                cities: string;
                daysTraveled: string;
                milesTraveled: string;
                reviews: string;
                averageRating: string;
                upcomingTrips_one: string;
                upcomingTrips_other: string;
                favoriteDestination: string;
            };
            badges: {
                title: string;
                earned: string;
                nextBadges: string;
                types: {
                    first_trip: {
                        name: string;
                        description: string;
                    };
                    explorer: {
                        name: string;
                        description: string;
                    };
                    world_traveler: {
                        name: string;
                        description: string;
                    };
                    early_booker: {
                        name: string;
                        description: string;
                    };
                    sustainable_traveler: {
                        name: string;
                        description: string;
                    };
                    reviewer: {
                        name: string;
                        description: string;
                    };
                    loyal_customer: {
                        name: string;
                        description: string;
                    };
                    adventure_seeker: {
                        name: string;
                        description: string;
                    };
                    culture_enthusiast: {
                        name: string;
                        description: string;
                    };
                    beach_lover: {
                        name: string;
                        description: string;
                    };
                    mountain_explorer: {
                        name: string;
                        description: string;
                    };
                    city_hopper: {
                        name: string;
                        description: string;
                    };
                    foodie_traveler: {
                        name: string;
                        description: string;
                    };
                    budget_savvy: {
                        name: string;
                        description: string;
                    };
                    luxury_traveler: {
                        name: string;
                        description: string;
                    };
                };
            };
            tabs: {
                personal: string;
                travel: string;
                preferences: string;
            };
            actions: {
                save: string;
                cancel: string;
                edit: string;
                delete: string;
                add: string;
            };
        };
    };
    readonly pt: {
        readonly about: {
            certifications: {
                title: string;
                subtitle: string;
                verified: string;
                items: {
                    turismoPortugal: {
                        name: string;
                        description: string;
                        type: string;
                    };
                    iata: {
                        name: string;
                        description: string;
                        type: string;
                    };
                    lre: {
                        name: string;
                        description: string;
                        type: string;
                    };
                };
            };
            company: {
                name: string;
                slogan: string;
                founder: string;
                founderTitle: string;
                founderAlt: string;
            };
            coreValues: {
                mainTitle1: string;
                mainTitle2: string;
                mainSubtitle: string;
                personalization: {
                    title: string;
                    desc: string;
                };
                sustainability: {
                    title: string;
                    desc: string;
                };
                ethicsIntegrity: {
                    title: string;
                    desc: string;
                };
                innovation: {
                    title: string;
                    desc: string;
                };
                clientFocus: {
                    title: string;
                    desc: string;
                };
                community: {
                    title: string;
                    desc: string;
                };
            };
            footer: {
                callNow: string;
                backToTop: string;
                cta: {
                    title: string;
                    subtitle: string;
                    contact: string;
                    explore: string;
                };
            };
            founder: {
                bio1: string;
                quote: string;
                badge1: string;
                badge2: string;
                badge3: string;
                title1: string;
                title2: string;
            };
            hero: {
                title1: string;
                title2: string;
                subtitle: string;
                cta: string;
            };
            mapContact: {
                title: string;
                address: string;
                phone: string;
                email: string;
            };
            partnerships: {
                title1: string;
                title2: string;
                subtitle: string;
                gea: {
                    desc: string;
                };
                sanjotec: {
                    desc: string;
                };
                dgconsulting: {
                    desc: string;
                };
                turismodeportugal: {
                    desc: string;
                };
                iapmei: {
                    desc: string;
                };
                startupportugal: {
                    desc: string;
                };
                officialPartner: string;
            };
            stats: {
                satisfiedClients: string;
                exclusiveDestinations: string;
                satisfactionRate: string;
                supportAvailable: string;
            };
            story: {
                title1: string;
                title2: string;
                subtitle: string;
                visionTitle: string;
                paragraph1: string;
                paragraph2: string;
                ourMission: string;
                missionStatement: string;
                imageAlt: string;
                location: string;
            };
            team: {
                title: string;
                subtitle: string;
                luis: {
                    name: string;
                    status: string;
                    bioTitle: string;
                    role: string;
                    bio: string;
                    fullBio: string;
                    curriculum: string[];
                    contact: string;
                    knowMore: string;
                    experience: string;
                    contactMe: string;
                };
            };
            trust: {
                title1: string;
                title2: string;
                subtitle: string;
            };
            newsletter: {
                title: string;
            };
            mobile: {
                app: {
                    app: string;
                };
            };
            help: {
                documentation: string;
            };
            legal: {
                terms: string;
                privacy: string;
                cookies: string;
                gdpr: string;
                cancellation: string;
            };
        };
        readonly activities: {
            activities: {
                title: string;
                subtitle: string;
                searchPlaceholder: string;
                searchButton: string;
                noActivitiesFound: string;
                errorFetching: string;
                viewOnTripAdvisor: string;
            };
            categories: {
                adventure: string;
                cultural: string;
                nature: string;
                water: string;
                food: string;
                entertainment: string;
                photography: string;
                wellness: string;
            };
            empty: string;
            title: string;
        };
        readonly activity: {
            empty: string;
            title: string;
        };
        readonly admin: {
            accessDenied: string;
            account_overview: {
                title: string;
                description: string;
            };
            actions: string;
            adminRequired: string;
            ai: {
                serviceStatus: {
                    title: string;
                    description: string;
                };
                results: {
                    chatTitle: string;
                    sentTitle: string;
                    priceTitle: string;
                    anomTitle: string;
                    itinTitle: string;
                };
                resultDisplay: {
                    processingTitle: string;
                    processingDesc: string;
                    successTitle: string;
                    errorTitle: string;
                    completionTimeLabel: string;
                    unknownError: string;
                    testingLabel: string;
                };
                history: {
                    title: string;
                    description: string;
                    noItems: string;
                    clearButton: string;
                    item: {
                        service: string;
                        title: string;
                        time: string;
                        duration: string;
                    };
                };
            };
            all: string;
            analytics: {
                title: string;
                subtitle: string;
                noData: string;
                noDataAvailable: string;
                loadingError: string;
                exporting: string;
                format: string;
                exportCSV: string;
                exportPDF: string;
                tabs: {
                    overview: string;
                    traffic: string;
                    conversion: string;
                    destinations: string;
                };
                kpi: {
                    bookings: string;
                    revenue: string;
                    users: string;
                    conversion: string;
                    avgOrder: string;
                    bounceRate: string;
                    perBooking: string;
                };
            };
            app: {
                name: string;
                version: string;
                "Toggle theme": string;
                "More options": string;
            };
            applyFilters: string;
            auth: string;
            backToLogs: string;
            blog: {
                blog_posts: string;
                social_media: string;
                create_new: string;
                author: string;
                select_author: string;
                excerpt: string;
                excerpt_placeholder: string;
                content: string;
                required_fields: string;
                view: string;
                edit: string;
                edit_description: string;
                archived: string;
                no_posts: string;
                create_first: string;
            };
            booking: string;
            breadcrumb: {
                home: string;
                admin: string;
            };
            breadcrumbs: {
                admin: string;
                users: string;
                analytics: string;
                dashboard: string;
                bookings: string;
                content: string;
                settings: string;
                reports: string;
                system: string;
            };
            cancel: string;
            category: string;
            clear: string;
            clearFilters: string;
            close: string;
            collapse: string;
            confirmDeleteLog: string;
            confirmDeleteSelected: string;
            copied: string;
            copyToClipboard: string;
            critical: string;
            dashboard: {
                title: string;
                subtitle: string;
                description: string;
                welcome: string;
                crm: string;
                crm_description: string;
                bookings: string;
                bookings_description: string;
                finances: string;
                finances_description: string;
                account: string;
                account_description: string;
                newsletter: string;
                newsletter_description: string;
                destinations: string;
                destinations_description: string;
                blog: string;
                blog_description: string;
                sustainable_travel: string;
                sustainable_travel_description: string;
                settings: string;
                settings_description: string;
                more: string;
                total_clients: string;
                active_bookings: string;
                monthly_revenue: string;
                conversion_rate: string;
                previous_month: string;
                recent_bookings: string;
                bookings_management: string;
                clients_management: string;
                general_settings: string;
                manage_admin_users: string;
                configure_email_templates: string;
                content_management: string;
                system_settings: string;
                data_backup: string;
                system_logs: string;
                export_data: string;
                activities: string;
                activities_description: string;
                content_hub: string;
                content_hub_description: string;
                financial_dashboard: string;
                financial_dashboard_description: string;
                financialDashboard: string;
                financial: string;
                content: string;
                users: string;
                payments: string;
            };
            dateRange: string;
            debug: string;
            delete: string;
            deleteLog: string;
            deleteLogError: string;
            deleteLogsError: string;
            deleteSelected: string;
            destinations: {
                title: string;
                subtitle: string;
                addNew: string;
                refresh: string;
                export: string;
                loading: string;
                loadSuccess: string;
                loadError: string;
                status: {
                    available: string;
                    limited: string;
                    fullybooked: string;
                    unavailable: string;
                };
                stats: {
                    total: string;
                    bookings: string;
                    revenue: string;
                    avgRating: string;
                    featured: string;
                    active: string;
                    totalBookingsDesc: string;
                    totalRevenueDesc: string;
                    totalReviews: string;
                };
                filters: {
                    title: string;
                    clear: string;
                    tabs: {
                        basic: string;
                        advanced: string;
                    };
                    search: string;
                    searchPlaceholder: string;
                    country: string;
                    allCountries: string;
                    category: string;
                    allCategories: string;
                    status: string;
                    allStatus: string;
                    priceRange: string;
                    minRating: string;
                    sortBy: string;
                };
                table: {
                    title: string;
                    page: string;
                    headers: {
                        destination: string;
                        category: string;
                        status: string;
                        price: string;
                        stats: string;
                        actions: string;
                    };
                    empty: string;
                };
                actions: {
                    view: string;
                    clone: string;
                    delete: string;
                    cloneSuccess: string;
                    deleteSuccess: string;
                    bulkDeleteSuccess: string;
                    statusUpdate: string;
                    featuredUpdate: string;
                    addFeatured: string;
                    removeFeatured: string;
                    activate: string;
                    deactivate: string;
                };
                price: {
                    startingFrom: string;
                    perDay: string;
                };
                selection: {
                    count: string;
                    clear: string;
                    delete: string;
                };
                confirmDelete: {
                    title: string;
                    message: string;
                    bulkMessage: string;
                };
            };
            draft: string;
            edit: string;
            enterSearchTerm: string;
            error: string;
            errorLoadingData: string;
            errorOccurred: string;
            expand: string;
            export: string;
            exportAsCSV: string;
            exportAsJSON: string;
            exportError: string;
            exportLogs: string;
            exportSuccess: string;
            failed: string;
            filters: {
                apply: string;
                clear: string;
                search: string;
                status: {
                    all: string;
                    active: string;
                    inactive: string;
                    pending: string;
                    completed: string;
                    cancelled: string;
                };
                date: {
                    today: string;
                    yesterday: string;
                    thisWeek: string;
                    lastWeek: string;
                    thisMonth: string;
                    lastMonth: string;
                    customRange: string;
                };
            };
            financial: {
                title: string;
                dashboardOverview: string;
                revenueVsExpenses: string;
                profitTrend: string;
                expenseCategories: string;
                annualSummary: string;
                totalRevenue: string;
                totalExpenses: string;
                totalProfit: string;
                avgMonthlyProfit: string;
                revenue: string;
                expenses: string;
                profit: string;
                transactions: string;
                noFinancialData: string;
                vsPreviousMonth: string;
                export: string;
                refresh: string;
            };
            footer: {
                adminLabel: string;
                admin: string;
                description: string;
                management: string;
                users: string;
                bookings: string;
                analytics: string;
                settings: string;
                content: string;
                posts: string;
                pages: string;
                media: string;
                newsletters: string;
                ecommerce: string;
                products: string;
                orders: string;
                financial: string;
                destinations: string;
                system: string;
                logs: string;
                maintenance: string;
                backup: string;
                security: string;
                support: string;
                documentation: string;
                supportTech: string;
                privacy: string;
                terms: string;
                quickDashboard: string;
                quickReports: string;
                goTo: string;
                copyrightLabel: string;
                version: string;
                versionLabel: string;
                lastUpdate: string;
                categories: {
                    empresa: string;
                    legal: string;
                    ajuda: string;
                };
                ia: {
                    preferences: string;
                    toggle: string;
                };
                nav: {
                    legal: string;
                };
                legal: {
                    terms: string;
                    privacy: string;
                    cookies: string;
                    gdpr: string;
                    "cancellation-policy": string;
                };
                social: {
                    links: string;
                };
            };
            forms: {
                save: string;
                cancel: string;
                delete: string;
                edit: string;
                create: string;
                update: string;
                reset: string;
                submit: string;
                back: string;
                next: string;
                previous: string;
                required: string;
                optional: string;
                success: string;
                error: string;
                warning: string;
                info: string;
                loading: string;
                search: string;
                noResults: string;
                selectPlaceholder: string;
                datePlaceholder: string;
            };
            from: string;
            info: string;
            ip: string;
            level: string;
            loading: string;
            logDeleted: string;
            logDetails: string;
            login: {
                welcome: string;
                subtitle: string;
                title: string;
                emailLabel: string;
                emailPlaceholder: string;
                passwordLabel: string;
                passwordPlaceholder: string;
                showPassword: string;
                hidePassword: string;
                rememberMe: string;
                forgotPassword: string;
                submit: string;
                submitting: string;
                noAccount: string;
                registerLink: string;
                notAdmin: string;
                backToSite: string;
            };
            logo: {
                link: string;
            };
            logout: string;
            logsDeleted: string;
            message: string;
            mobile_menu: {
                toggle: string;
                title: string;
            };
            navigation: {
                profile: string;
                myProfile: string;
                settings: string;
                signOut: string;
                mobile: string;
                desktop: string;
                admin: string;
                dashboard: string;
                users: string;
                bookings: string;
                content: string;
                core: string;
                analytics: string;
                reports: string;
                contentManagement: string;
                blog: string;
                newsletters: string;
                sustainableTravel: string;
                destinations: string;
                financial: string;
                financialDashboard: string;
                account: string;
                ecommerce: string;
                products: string;
                allProducts: string;
                newProduct: string;
                inventory: string;
                orders: string;
                userManagement: string;
                allUsers: string;
                rolesAndPermissions: string;
                system: string;
                general: string;
                appearance: string;
                notifications: string;
                security: string;
                database: string;
                systemLogs: string;
                maintenance: string;
                technicalSupport: string;
            };
            noDataAvailable: string;
            noLogs: string;
            noLogsFound: string;
            notifications: {
                toggle: string;
                title: string;
                empty: string;
            };
            notificationsMessages: {
                success: string;
                error: string;
                warning: string;
                info: string;
                saved: string;
                deleted: string;
                updated: string;
                created: string;
            };
            pagination: {
                itemsPerPage: string;
                of: string;
                previous: string;
                next: string;
                first: string;
                last: string;
            };
            panelTitle: string;
            payment: string;
            pleaseWait: string;
            profile: {
                title: string;
                subtitle: string;
                tabs: {
                    profile: string;
                    security: string;
                    notifications: string;
                };
                personalInfo: string;
                personalInfoDesc: string;
                name: string;
                namePlaceholder: string;
                email: string;
                emailPlaceholder: string;
                phone: string;
                phonePlaceholder: string;
                role: string;
                bio: string;
                bioPlaceholder: string;
                save: string;
                saving: string;
                updateSuccess: string;
                updateSuccessDesc: string;
                updateError: string;
                updateErrorDesc: string;
                security: string;
                securityDesc: string;
                currentPassword: string;
                newPassword: string;
                confirmPassword: string;
                updatePassword: string;
                updating: string;
                passwordMismatch: string;
                passwordMismatchDesc: string;
                passwordSuccess: string;
                passwordSuccessDesc: string;
                passwordError: string;
                passwordErrorDesc: string;
                notifications: string;
                notificationsDesc: string;
                emailNotifications: string;
                emailNotificationsDesc: string;
                pushNotifications: string;
                pushNotificationsDesc: string;
                weeklyReports: string;
                weeklyReportsDesc: string;
            };
            recentLogs: string;
            refresh: string;
            register: {
                welcome: string;
                subtitle: string;
                title: string;
                errorTitle: string;
                nameLabel: string;
                namePlaceholder: string;
                emailLabel: string;
                emailPlaceholder: string;
                passwordLabel: string;
                passwordPlaceholder: string;
                confirmPasswordLabel: string;
                confirmPasswordPlaceholder: string;
                submit: string;
                submitting: string;
                haveAccount: string;
                loginLink: string;
                backToSite: string;
                copyright: string;
                validation: {
                    required: string;
                    passwordMismatch: string;
                    success: string;
                    error: string;
                };
            };
            retry: string;
            roles: {
                admin: string;
                user: string;
                moderator: string;
            };
            save: string;
            scheduled: string;
            search: {
                toggle: string;
                placeholder: string;
            };
            searchInLogs: string;
            security: string;
            selectAll: string;
            sent: string;
            settings: {
                title: string;
            };
            sidebar: {
                label: string;
                footerAriaLabel: string;
            };
            success: string;
            system: string;
            theme: {
                toggle: string;
                Dark: string;
                Light: string;
                System: string;
                Theme: string;
                Simple: string;
            };
            timestamp: string;
            to: string;
            transaction_history: {
                title: string;
                dashboardOverview: string;
                revenueVsExpenses: string;
                profitTrend: string;
                expenseCategories: string;
                totalRevenue: string;
                totalExpenses: string;
                totalProfit: string;
                avgMonthlyProfit: string;
                revenue: string;
                expenses: string;
                profit: string;
                export: string;
            };
            tryAgain: string;
            user: {
                role: string;
            };
            userAgent: string;
            user_menu: {
                toggle: string;
                logout: string;
            };
            users: {
                title: string;
                subtitle: string;
                addUserDesc: string;
                editUserDesc: string;
                addNew: string;
                search: string;
                filters: string;
                deleteSelected: string;
                table: {
                    name: string;
                    email: string;
                    role: string;
                    status: string;
                    lastLogin: string;
                    actions: string;
                    joined: string;
                    showing: string;
                    joinDate: string;
                    password: string;
                    empty: string;
                };
                pagination: {
                    previous: string;
                    next: string;
                };
                roles: {
                    all: string;
                    admin: string;
                    editor: string;
                    viewer: string;
                };
                status: {
                    all: string;
                    active: string;
                    inactive: string;
                    suspended: string;
                };
            };
            users_description: string;
            validation: {
                required: string;
                email: string;
                minLength: string;
                maxLength: string;
                passwordsDontMatch: string;
                invalidFormat: string;
                invalidUrl: string;
                invalidDate: string;
            };
            viewLogDetails: string;
            warning: string;
        };
        readonly 'ai-preferences': {
            common: {
                notSet: string;
                unknown: string;
                cancel: string;
                clear: string;
                minutesShort: string;
                ai: string;
            };
            localModel: {
                specs: {
                    model: string;
                    size: string;
                    context: string;
                    memory: string;
                };
                benefits: {
                    zeroApiCosts: string;
                    completePrivacy: string;
                    offlineCapability: string;
                };
            };
            privacyTrust: {
                features: {
                    localProcessing: {
                        title: string;
                        description: string;
                    };
                    dataPrivacy: {
                        title: string;
                        description: string;
                    };
                    noDataCollection: {
                        title: string;
                        description: string;
                    };
                    offlineCapability: {
                        title: string;
                        description: string;
                    };
                };
                trustIndicators: {
                    zeroApiCosts: string;
                    noRateLimits: string;
                    completeDataOwnership: string;
                    gdprCompliant: string;
                    noThirdPartyDependencies: string;
                    openSourceModel: string;
                };
            };
            advancedSettings: {
                performance: {
                    title: string;
                    description: string;
                    cache: {
                        title: string;
                        description: string;
                        active: string;
                        hitRate: string;
                    };
                };
                dataIntegration: {
                    title: string;
                    description: string;
                };
                integrations: {
                    title: string;
                    description: string;
                    enableRealTimeData: string;
                    enableWeatherIntegration: string;
                    enableCurrencyConversion: string;
                };
                experimental: {
                    title: string;
                    description: string;
                    beta: string;
                    warning: string;
                    notAvailable: string;
                };
                metrics: {
                    title: string;
                    averageResponseTime: string;
                    cacheHitRate: string;
                    successRate: string;
                    totalRequests: string;
                };
                apiStatus: {
                    title: string;
                    openai: string;
                    weather: string;
                    currency: string;
                    connected: string;
                    active: string;
                    inactive: string;
                    error: string;
                    disconnected: string;
                };
            };
            aiPoweredFeatures: {
                profileAnalysis: {
                    title: string;
                    empty: string;
                };
                travelerProfile: {
                    title: string;
                    travelerType: string;
                    primaryInterests: string;
                };
            };
            modelTab: {
                hero: {
                    title: string;
                    subtitle: string;
                };
                sections: {
                    modelSelection: {
                        title: string;
                        subtitle: string;
                    };
                    parameters: {
                        title: string;
                        subtitle: string;
                    };
                    aiFeatures: {
                        title: string;
                        subtitle: string;
                        badge: string;
                    };
                    performance: {
                        title: string;
                        subtitle: string;
                    };
                    dataIntegration: {
                        title: string;
                        subtitle: string;
                    };
                };
                labels: {
                    model: string;
                    temperature: string;
                    maxTokens: string;
                    status: string;
                    configured: string;
                    incomplete: string;
                    setupInProgress: string;
                };
                groups: {
                    coreSettings: string;
                    advanced: string;
                };
            };
            welcome: {
                title: string;
                subtitle: string;
                button: string;
            };
            status: {
                synced: string;
                loading: string;
                syncing: string;
                hasChanges: string;
                unsaved: string;
            };
            import: {
                tooltip: string;
                success: string;
                successDescription: string;
            };
            reset: {
                tooltip: string;
                success: string;
                successDescription: string;
                dialog: {
                    title: string;
                    description: string;
                    confirm: string;
                    cancel: string;
                };
            };
            modes: {
                quickstart: {
                    badge: string;
                    title: string;
                    description: string;
                    skipLink: string;
                };
                guided: {
                    title: string;
                    subtitle: string;
                    quickStartDone: string;
                };
                power: {
                    badge: string;
                    title: string;
                    description: string;
                    backToGuided: string;
                };
            };
            powerMode: {
                title: string;
                description: string;
                reveal: string;
                hide: string;
                features: {
                    analytics: {
                        title: string;
                        description: string;
                    };
                    model: {
                        title: string;
                        description: string;
                    };
                    export: {
                        title: string;
                        description: string;
                    };
                    api: {
                        title: string;
                        description: string;
                    };
                };
            };
            messages: {
                quickStartComplete: string;
            };
            buttons: {
                backToQuickStart: string;
                previous: string;
                next: string;
                submit: string;
            };
            tabs: {
                tripBasics: {
                    label: string;
                    description: string;
                };
                personalization: {
                    label: string;
                    description: string;
                };
                travelPreferences: {
                    label: string;
                    description: string;
                };
                aiBehavior: {
                    label: string;
                    description: string;
                };
                privacy: {
                    label: string;
                    description: string;
                };
                review: {
                    label: string;
                    description: string;
                };
            };
            sections: {
                accessibility: string;
                accessibilityDescription: string;
                dietary: string;
                dietaryDescription: string;
            };
            description: string;
            help: {
                message: string;
                contact: string;
                about: string;
            };
            search: {
                placeholder: string;
                tooltip: string;
            };
            changesDetected: string;
            changesDetectedDesc: string;
            experimental: {
                title: string;
                description: string;
            };
            activities: {
                museums: string;
                gastronomy: string;
                nightlife: string;
                shopping: string;
                watersports: string;
                hiking: string;
                photography: string;
                architecture: string;
                festivals: string;
                nature: string;
                beaches: string;
                mountains: string;
                spa: string;
                adventure: string;
                heritage: string;
                hiking_extra: string;
                nightlife_extra: string;
                shopping_extra: string;
                culinary: string;
            };
            currencies: {
                EUR: string;
                USD: string;
                GBP: string;
                BRL: string;
            };
            errorResetting: string;
            errorSaving: string;
            advanced: {
                title: string;
                description: string;
                comingSoon: string;
                recommendations: {
                    title: string;
                    subtitle: string;
                    enabledLabel: string;
                    featuresTitle: string;
                };
                dataSharing: {
                    title: string;
                    subtitle: string;
                    generalLabel: string;
                    personalizedLabel: string;
                    analyticsLabel: string;
                    marketingLabel: string;
                };
                notifications: {
                    title: string;
                    subtitle: string;
                    enabledLabel: string;
                    channelsLabel: string;
                    typesLabel: string;
                    channelSelected: string;
                    channelNotSelected: string;
                };
                loyalty: {
                    title: string;
                    subtitle: string;
                    noPrograms: string;
                    addButton: string;
                };
            };
            languages: {
                pt: string;
                en: string;
                es: string;
                fr: string;
                de: string;
                it: string;
            };
            loading: string;
            loadingStats: string;
            page: {
                title: string;
                subtitle: string;
            };
            modelSettings: {
                title: string;
                description: string;
                selectedModel: string;
                modelInfo: string;
                maxTokens: string;
                costPerToken: string;
                capabilities: string;
                parameters: {
                    title: string;
                    description: string;
                    temperature: {
                        label: string;
                        description: string;
                    };
                    maxTokensParam: {
                        label: string;
                        description: string;
                    };
                    topP: {
                        label: string;
                        description: string;
                    };
                    frequencyPenalty: {
                        label: string;
                        description: string;
                    };
                    presencePenalty: {
                        label: string;
                        description: string;
                    };
                };
            };
            personalization: {
                personality: {
                    title: string;
                    description: string;
                    personalityType: string;
                    professional: {
                        label: string;
                        description: string;
                        example: string;
                    };
                    friendly: {
                        label: string;
                        description: string;
                        example: string;
                    };
                    enthusiastic: {
                        label: string;
                        description: string;
                        example: string;
                    };
                    detailed: {
                        label: string;
                        description: string;
                        example: string;
                    };
                    concise: {
                        label: string;
                        description: string;
                        example: string;
                    };
                };
                responseLength: {
                    title: string;
                    description: string;
                    short: {
                        label: string;
                        description: string;
                    };
                    medium: {
                        label: string;
                        description: string;
                    };
                    detailed: {
                        label: string;
                        description: string;
                    };
                };
                features: {
                    title: string;
                    description: string;
                    includeLocalTips: string;
                    includeBudgetBreakdown: string;
                    includeAlternatives: string;
                };
                settings: {
                    title: string;
                    description: string;
                    selected: string;
                    selectedType: string;
                    stars: string;
                    dietary: {
                        label: string;
                        none_selected: string;
                        removeAriaLabel: string;
                        options: {
                            vegetarian: string;
                            vegan: string;
                            glutenfree: string;
                            dairyfree: string;
                            nutfree: string;
                            lowcarb: string;
                            cholesterolfree: string;
                        };
                    };
                    pacing: {
                        label: string;
                        placeholder: string;
                        none_selected: string;
                        descriptions: {
                            fast: string;
                            moderate: string;
                            slow: string;
                        };
                        fast: string;
                        moderate: string;
                        slow: string;
                    };
                    accessibility: {
                        label: string;
                        none_selected: string;
                        removeAriaLabel: string;
                        options: {
                            screenreader: string;
                            closedcaptions: string;
                            wheelchair: string;
                        };
                    };
                    accommodation: {
                        label: string;
                        placeholder: string;
                        hotel: string;
                        resort: string;
                        airbnb: string;
                        hostel: string;
                        apartment: string;
                        accessible: string;
                        descriptions: {
                            accommodation: {
                                hotel: string;
                                resort: string;
                                airbnb: string;
                                hostel: string;
                                apartment: string;
                                accessible: string;
                            };
                        };
                        options: {
                            hotel: string;
                            resort: string;
                            airbnb: string;
                            hostel: string;
                            apartment: string;
                            accessible: string;
                        };
                    };
                    cruise: {
                        toggle: {
                            label: string;
                        };
                        hint: string;
                        collapsedHint: string;
                        types: {
                            river: {
                                title: string;
                                subtitle: string;
                            };
                            sea: {
                                title: string;
                                subtitle: string;
                            };
                        };
                        regions: {
                            riverTitle: string;
                            seaTitle: string;
                            options: {
                                european: string;
                                asian: string;
                                african: string;
                                american: string;
                                caribbean: string;
                                mediterranean: string;
                                alaska: string;
                                nordic: string;
                                transatlantic: string;
                            };
                        };
                        duration: {
                            title: string;
                            options: {
                                short: {
                                    label: string;
                                    days: string;
                                };
                                medium: {
                                    label: string;
                                    days: string;
                                };
                                long: {
                                    label: string;
                                    days: string;
                                };
                            };
                        };
                        cabin: {
                            title: string;
                            options: {
                                interior: {
                                    label: string;
                                    description: string;
                                };
                                oceanview: {
                                    label: string;
                                    description: string;
                                };
                                balcony: {
                                    label: string;
                                    description: string;
                                };
                                suite: {
                                    label: string;
                                    description: string;
                                };
                            };
                        };
                    };
                };
            };
            preferencesReset: string;
            preferencesSaved: string;
            preferencesUpdated: string;
            privacySettings: {
                title: string;
                description: string;
                saveSearchHistory: string;
                shareDataForImprovement: string;
                allowPersonalization: string;
            };
            restoreDefaults: string;
            saveChanges: string;
            saving: string;
            subtitle: string;
            pageTabs: {
                model: string;
                travel: string;
                personalization: string;
                advanced: string;
                privacy: string;
                analytics: string;
            };
            title: string;
            model: {
                title: string;
                description: string;
                selectedModel: string;
                modelInfo: string;
                maxTokens: string;
                costPerToken: string;
                costWarning: {
                    title: string;
                    message: string;
                };
                resetToDefaults: string;
                status: {
                    available: string;
                    unavailable: string;
                    comingSoon: string;
                };
                estimatedMonthlyCost: string;
                performance: {
                    title: string;
                    speed: string;
                    accuracy: string;
                    creativity: string;
                };
                capabilities: {
                    title: string;
                };
            };
            parameters: {
                title: string;
                description: string;
                temperature: {
                    label: string;
                    description: string;
                    levels: {
                        focused: string;
                        balanced: string;
                        creative: string;
                    };
                };
                maxTokens: {
                    label: string;
                    description: string;
                    words: string;
                };
                topP: {
                    label: string;
                    description: string;
                };
                frequencyPenalty: {
                    label: string;
                    description: string;
                };
                presencePenalty: {
                    label: string;
                    description: string;
                };
                advanced: {
                    title: string;
                };
            };
            travelPreferences: {
                budget: {
                    title: string;
                    description: string;
                    badge: string;
                    currencyLabel: string;
                    currencyPlaceholder: string;
                    rangeLabel: string;
                    maxBudgetPercent: string;
                    info: string;
                    defaultTitle: string;
                    rangeTitle: string;
                    rangeSubtitle: string;
                    amplitude: string;
                    presetAriaLabel: string;
                    minLabel: string;
                    maxLabel: string;
                    minTooltip: string;
                    maxTooltip: string;
                    visualizationTitle: string;
                    minShort: string;
                    available: string;
                    errors: {
                        multipleIssues: string;
                    };
                    presets: {
                        economic: string;
                        balanced: string;
                        premium: string;
                    };
                };
                travelStyle: {
                    title: string;
                    description: string;
                    travelersLabel: string;
                    selector: {
                        title: string;
                        subtitle: string;
                        selected: string;
                        recommendedActivities: string;
                    };
                    types: {
                        luxury: {
                            label: string;
                            description: string;
                        };
                        comfort: {
                            label: string;
                            description: string;
                        };
                        budget: {
                            label: string;
                            description: string;
                        };
                        adventure: {
                            label: string;
                            description: string;
                        };
                        cultural: {
                            label: string;
                            description: string;
                        };
                        relaxation: {
                            label: string;
                            description: string;
                        };
                    };
                    luxury: {
                        label: string;
                        description: string;
                    };
                    comfort: {
                        label: string;
                        description: string;
                    };
                    budget: {
                        label: string;
                        description: string;
                    };
                    adventure: {
                        label: string;
                        description: string;
                    };
                    cultural: {
                        label: string;
                        description: string;
                    };
                    relaxation: {
                        label: string;
                        description: string;
                    };
                };
                sustainability: {
                    title: string;
                    description: string;
                    levelLabel: string;
                    levelDescription: string;
                    ecoLabel: string;
                    ecoDescription: string;
                    infoTooltip: string;
                    certificationsLabel: string;
                    certificationsDescription: string;
                    summaryTitle: string;
                    summaryBody: string;
                    impactLevels: {
                        excellent: string;
                        good: string;
                        moderate: string;
                        tobetter: string;
                    };
                    indicators: {
                        low: string;
                        high: string;
                        score: string;
                    };
                    low: {
                        label: string;
                        description: string;
                        impact: string;
                    };
                    medium: {
                        label: string;
                        description: string;
                        impact: string;
                    };
                    high: {
                        label: string;
                        description: string;
                        impact: string;
                    };
                    ecoPreferencesOptions: {
                        carbon_offsetting: {
                            label: string;
                            description: string;
                        };
                        eco_hotels: {
                            label: string;
                            description: string;
                        };
                        public_transport: {
                            label: string;
                            description: string;
                        };
                        local_food: {
                            label: string;
                            description: string;
                        };
                        wildlife_protection: {
                            label: string;
                            description: string;
                        };
                        water_conservation: {
                            label: string;
                            description: string;
                        };
                        renewable_energy: {
                            label: string;
                            description: string;
                        };
                        zero_waste: {
                            label: string;
                            description: string;
                        };
                    };
                    certificationsOptions: {
                        leed: {
                            label: string;
                            description: string;
                        };
                        green_key: {
                            label: string;
                            description: string;
                        };
                        blue_flag: {
                            label: string;
                            description: string;
                        };
                        earth_check: {
                            label: string;
                            description: string;
                        };
                        green_globe: {
                            label: string;
                            description: string;
                        };
                        eco_label: {
                            label: string;
                            description: string;
                        };
                        none: {
                            label: string;
                            description: string;
                        };
                    };
                };
                travelers: {
                    title: string;
                    description: string;
                };
                activities: {
                    title: string;
                    description: string;
                    addActivity: string;
                    popularActivities: string;
                    selectedLabel: string;
                    clearAll: string;
                    availableLabel: string;
                    limitReached: string;
                    searchPlaceholder: string;
                    limitAlert: string;
                    alreadySelected: string;
                    selectActivity: string;
                    removeActivity: string;
                };
                suggestions: {
                    title: string;
                    available: string;
                    match: string;
                    potentialSavings: string;
                    category: string;
                    moreAvailable: string;
                    footer: string;
                    dismiss: string;
                    sugestion: string;
                };
            };
            usageAnalytics: {
                title: string;
                totalRequests: string;
                tokensUsed: string;
                averageResponseTime: string;
                successRate: string;
                favoriteFeatures: string;
                monthlyUsage: string;
                performanceInsights: string;
                performanceInsightsDescription: string;
                usagePatterns: string;
                mostActiveTime: string;
                preferredDay: string;
                avgSessionDuration: string;
                recommendations: string;
                optimization: string;
                optimizationDesc: string;
                personalization: string;
                personalizationDesc: string;
                achievement: string;
                achievementDesc: string;
                monthlyUsageDescription: string;
                monthlyGrowth: string;
                favoriteFeaturesDescription: string;
            };
            dashboard: {
                intelligenceScore: string;
                configurationSteps: string;
                overallProgress: string;
                scoreCards: {
                    intelligence: {
                        title: string;
                        subtitle: string;
                    };
                    traveler: {
                        title: string;
                        subtitle: string;
                    };
                    sustainability: {
                        title: string;
                        subtitle: string;
                    };
                };
                navigation: {
                    previous: string;
                    continue: string;
                    completeSetup: string;
                };
                auth: {
                    saveTitle: string;
                    saveDescription: string;
                    loginButton: string;
                };
            };
            steps: {
                profile: {
                    label: string;
                    description: string;
                };
                style: {
                    label: string;
                    description: string;
                };
                budget: {
                    label: string;
                    description: string;
                };
                preferences: {
                    label: string;
                    description: string;
                };
                activities: {
                    label: string;
                    description: string;
                };
                accessibility: {
                    label: string;
                    description: string;
                };
                settings: {
                    label: string;
                    description: string;
                };
            };
            languageSelection: {
                title: string;
                selectedTitle: string;
                addLanguage: string;
                chooseLanguage: string;
                noneSelected: string;
                searchPlaceholder: string;
                noResults: string;
                recommendationsTitle: string;
                clickToAdd: string;
                proficiency: string;
                basic: string;
                intermediate: string;
                fluent: string;
                chooseProficiency: string;
            };
            days: {
                monday: string;
                tuesday: string;
                wednesday: string;
                thursday: string;
                friday: string;
                saturday: string;
                sunday: string;
            };
            form: {
                title: string;
                tabs: {
                    basics: string;
                    budget: string;
                    personalization: string;
                    sustainable: string;
                    travel: string;
                    model: string;
                    privacy: string;
                    review: string;
                };
                saveDraft: string;
                next: string;
                previous: string;
                save: string;
                reset: string;
                cancel: string;
            };
            review: {
                missing: string;
                complete: string;
                applied: string;
                enabled: string;
                disabled: string;
                ready: string;
                hint: string;
                completeSetup: string;
                modifyLater: string;
                sections: {
                    basics: {
                        title: string;
                    };
                    personalization: {
                        title: string;
                    };
                    travel: {
                        title: string;
                    };
                    model: {
                        title: string;
                    };
                    privacy: {
                        title: string;
                    };
                };
                fields: {
                    activities: string;
                    budget: string;
                    destination: string;
                    dates: string;
                    travelers: string;
                    model: string;
                    creativity: string;
                    responseLength: string;
                    dataSharing: string;
                    analytics: string;
                    notifications: string;
                };
            };
        };
        readonly auth: {
            accessDenied: string;
            and: string;
            back_to_home: string;
            byContinuing: string;
            create_account: string;
            demo: {
                user: string;
                admin: string;
            };
            email_label: string;
            email_placeholder: string;
            exclusive_trips: string;
            facebook_sign_in: string;
            forgot_password: string;
            form: {
                password: string;
                showPassword: string;
                rememberMe: string;
                forgotPassword: string;
                signIn: string;
                loggingIn: string;
            };
            google_sign_in: string;
            insufficientPermissions: string;
            invalid_credentials: string;
            login: {
                title: string;
                subtitle: string;
                email: string;
                emailRequired: string;
                invalidEmail: string;
                password: string;
                passwordRequired: string;
                passwordMinLength: string;
                rememberMe: string;
                signIn: string;
                orSignInWithEmail: string;
            };
            loginRequired: string;
            loginSuccess: string;
            noAccount: string;
            no_account: string;
            or: string;
            orContinueWith: string;
            password_label: string;
            password_placeholder: string;
            pleaseLoginToContinue: string;
            privacy: string;
            register: string;
            remember_me: string;
            required_fields: string;
            secure: string;
            signIn: string;
            signUp: string;
            sign_in: string;
            signing_in: string;
            subtitle: string;
            success: string;
            support: string;
            terms: string;
            unexpected_error: string;
            weak: string;
            welcome: string;
        };
        readonly blog: {
            pageTitle: {
                exploring: string;
                tag: string;
                search: string;
                default: string;
            };
            description: string;
            accessibility: {
                skipToContent: string;
                openMenu: string;
                closeMenu: string;
                searchArticles: string;
                filterArticles: string;
                articleImage: string;
                authorAvatar: string;
            };
            back: string;
            categories: {
                all: string;
                sustainability: string;
                security: string;
                trends2026: string;
                destinations: string;
                technology: string;
                experiences: string;
                economy: string;
                transport: string;
                wellness: string;
                future: string;
                regulation: string;
                destinations_key: string;
                "travel-tips": string;
                adventure: string;
                gastronomy: string;
                ecotourism: string;
                culture: string;
                itineraries: string;
            };
            comments: {
                title: string;
                count: string;
                count_plural: string;
                show: string;
                hide: string;
                add: string;
                placeholder: string;
                submit: string;
                reply: string;
                edit: string;
                delete: string;
                report: string;
                like: string;
                likes: string;
                likes_plural: string;
                replies: string;
                replies_plural: string;
                showReplies: string;
                hideReplies: string;
                guest: string;
                loginRequired: string;
                moderation: string;
                approved: string;
                rejected: string;
                empty: string;
            };
            error: {
                loading: string;
                notFound: string;
                network: string;
                server: string;
                permission: string;
                retry: string;
            };
            featured: {
                title: string;
                subtitle: string;
                readArticle: string;
                badge: string;
            };
            filters: {
                title: string;
                category: string;
                sustainability: string;
                security: string;
                trendScore: string;
                author: string;
                date: string;
                featured: string;
                clear: string;
                apply: string;
            };
            footer: {
                copyright: string;
                terms: string;
                privacy: string;
            };
            hero: {
                badge: string;
                title: string;
                subtitle: string;
            };
            loadMore: string;
            meta: {
                title: string;
                description: string;
                keywords: string;
            };
            navigation: {
                back: string;
                home: string;
                categories: string;
                search: string;
                filter: string;
            };
            newsletter: {
                title: string;
                description: string;
                placeholder: string;
                subscribe: string;
                subscribed: string;
                error: string;
            };
            pagination: {
                previous: string;
                next: string;
                page: string;
                showing: string;
            };
            post: {
                meta: {
                    readTime: string;
                    publishedDate: string;
                    updatedDate: string;
                    views: string;
                    views_plural: string;
                };
                actions: {
                    like: string;
                    unlike: string;
                    bookmark: string;
                    unbookmark: string;
                    share: string;
                    copy: string;
                    report: string;
                    edit: string;
                };
                share: {
                    title: string;
                    facebook: string;
                    twitter: string;
                    linkedin: string;
                    whatsapp: string;
                    email: string;
                    copyLink: string;
                    linkCopied: string;
                };
                author: {
                    about: string;
                    verified: string;
                    articles: string;
                    articles_plural: string;
                    contact: string;
                };
                trending: {
                    badge: string;
                    score: string;
                };
            };
            posts: {
                title: string;
                readMore: string;
                readTime: string;
                backToBlog: string;
                resultsFound: string;
                noResults: {
                    title: string;
                    description: string;
                };
                count: string;
                views: string;
                views_plural: string;
                likes: string;
                likes_plural: string;
                publishedAt: string;
                author: string;
                category: string;
                tags: string;
                noContent: string;
                loadMore: string;
                loading: string;
                error: string;
            };
            readingProgress: {
                title: string;
                completed: string;
                timeRemaining: string;
            };
            relatedContent: {
                destinations: string;
                services: string;
                posts: string;
                viewDestination: string;
                viewService: string;
                bookNow: string;
                from: string;
                perDay: string;
                rating: string;
                safetyRating: string;
            };
            relatedDestinations: string;
            relatedPosts: string;
            relatedServices: string;
            search: {
                placeholder: string;
                allCategories: string;
                noResults: string;
                resultsCount: string;
                resultsCount_plural: string;
            };
            security: {
                high: string;
                medium: string;
                low: string;
            };
            sidebar: {
                trending: string;
                sustainableDestinations: string;
                experts: string;
                newsletter: string;
                social: string;
                recentPosts: string;
                popularTags: string;
            };
            stats: {
                title: string;
                totalPosts: string;
                totalViews: string;
                avgSustainability: string;
                secureDestinations: string;
                trendingTopics: string;
                categories: string;
                authors: string;
                thisMonth: string;
                growth: string;
                engagement: string;
            };
            success: {
                liked: string;
                bookmarked: string;
                shared: string;
                commented: string;
                subscribed: string;
            };
            sustainability: {
                title: string;
                rating: string;
                ecoFriendly: string;
                carbonNeutral: string;
                regenerative: string;
            };
            toc: {
                title: string;
                hide: string;
                show: string;
            };
            trending: {
                title: string;
                posts: string;
                topics: string;
                destinations: string;
                authors: string;
            };
            viewMode: {
                grid: string;
                list: string;
            };
            filtersPanel: {
                title: string;
                clear: string;
                search: {
                    label: string;
                    placeholder: string;
                };
                category: {
                    label: string;
                    placeholder: string;
                };
                tag: {
                    label: string;
                    placeholder: string;
                };
                sort: {
                    label: string;
                    options: {
                        recent: string;
                        popular: string;
                        az: string;
                        za: string;
                    };
                };
                updating: string;
            };
            searchAndFilter: {
                search: {
                    placeholder: string;
                    submit: string;
                };
            };
            newsletterInline: {
                title: string;
                description: string;
                emailPlaceholder: string;
                subscribe: string;
            };
            popularCategories: {
                title: string;
                items: {
                    beaches: string;
                    ecotourism: string;
                    gastronomy: string;
                    culture: string;
                    adventure: string;
                };
            };
            grid: {
                range: {
                    empty: string;
                    showing: string;
                };
                noResults: {
                    title: string;
                    titleWithQuery: string;
                    description: string;
                    descriptionWithQuery: string;
                    viewAll: string;
                };
                activeFilters: {
                    category: string;
                    tag: string;
                    search: string;
                    clearAll: string;
                };
                pagination: {
                    previous: string;
                    next: string;
                    page: string;
                };
            };
            article: {
                actions: {
                    viewAll: string;
                };
                loadError: {
                    title: string;
                    description: string;
                };
                content: {
                    unavailable: string;
                    loading: string;
                };
                footer: {
                    lastUpdated: string;
                };
                meta: {
                    readingTimeMinutes: string;
                    siteNameFallback: string;
                    fallbackDescription: string;
                    fallbackOpenGraphTitle: string;
                    fallbackOpenGraphDescription: string;
                    twitterHandleFallback: string;
                    notFoundTitle: string;
                };
            };
        };
        readonly booking: {
            buttons: {
                next: string;
                previous: string;
                book: string;
                cancel: string;
            };
            confirmation: {
                success: string;
                thankYou: string;
                bookingNumber: string;
                email: string;
            };
            form: {
                firstName: string;
                lastName: string;
                email: string;
                phone: string;
                address: string;
                city: string;
                country: string;
                postalCode: string;
            };
            payment: {
                method: string;
                cardNumber: string;
                expiryDate: string;
                cvv: string;
                cardHolder: string;
            };
            steps: {
                personal: string;
                payment: string;
                confirmation: string;
            };
            subtitle: string;
            title: string;
            validation: {
                required: string;
                email: string;
                phone: string;
                card: string;
            };
            destinations: {
                santorini: {
                    name: string;
                    duration: string;
                    includes: string[];
                };
                tokyo: {
                    name: string;
                    duration: string;
                    includes: string[];
                };
                bali: {
                    name: string;
                    duration: string;
                    includes: string[];
                };
            };
            pageTitle: string;
            perPersonSuffix: string;
            step1: {
                title: string;
                departureDate: string;
                returnDate: string;
                travelers: string;
                travelerCount_one: string;
                travelerCount_other: string;
                accommodation: {
                    title: string;
                    options: {
                        standard: string;
                        premium: string;
                        luxury: string;
                    };
                    pricePrefix: string;
                    included: string;
                };
                specialRequests: {
                    label: string;
                    placeholder: string;
                };
            };
            step2: {
                title: string;
                fullName: string;
                fullNamePlaceholder: string;
                email: string;
                emailPlaceholder: string;
                phone: string;
                phonePlaceholder: string;
                document: string;
                documentPlaceholder: string;
                security: {
                    title: string;
                    description: string;
                };
            };
            step3: {
                title: string;
                travelerCount_one: string;
                travelerCount_other: string;
                rating: string;
                priceDetails: {
                    title: string;
                    basePackage: string;
                    accommodationUpgrade: string;
                    taxes: string;
                };
                included: {
                    title: string;
                    travelInsurance: string;
                    support: string;
                };
                policies: {
                    title: string;
                    cancellation: string;
                    changes: string;
                    documentation: string;
                    vaccines: string;
                };
                total: string;
            };
            step4: {
                title: string;
                paymentMethod: {
                    title: string;
                    credit: {
                        name: string;
                        description: string;
                    };
                    pix: {
                        name: string;
                        description: string;
                    };
                };
                creditCard: {
                    number: string;
                    numberPlaceholder: string;
                    expiry: string;
                    expiryPlaceholder: string;
                    cvv: string;
                    cvvPlaceholder: string;
                    name: string;
                    namePlaceholder: string;
                };
                pix: {
                    title: string;
                    description: string;
                    totalWithDiscount: string;
                };
                terms: {
                    agree: string;
                    service: string;
                    privacy: string;
                };
                orderSummary: {
                    title: string;
                    subtotal: string;
                    taxes: string;
                    pixDiscount: string;
                    securePayment: string;
                    instantConfirmation: string;
                };
            };
        };
        readonly bookings: {
            bookNow: string;
            getStarted: string;
            noBookings: string;
            subtitle: string;
            title: string;
        };
        readonly careers: {
            hero: {
                title: string;
                subtitle: string;
                badge: string;
            };
            benefits: {
                title: string;
                health: string;
                health_desc: string;
                flex: string;
                flex_desc: string;
                growth: string;
                growth_desc: string;
                tech: string;
                tech_desc: string;
            };
            cta: {
                badge: string;
                title: string;
                subtitle: string;
                button: string;
            };
            form: {
                title: string;
            };
            application: {
                title: string;
                close: string;
                name: string;
                email: string;
                phone: string;
                linkedin: string;
                message: {
                    label: string;
                    placeholder: string;
                };
                cv: {
                    label: string;
                    upload: string;
                    drag: string;
                    format: string;
                };
                error: string;
                submitting: string;
                submit: string;
                success: {
                    title: string;
                    message: string;
                };
            };
            job: {
                none: string;
                checkback: string;
                spontaneous: string;
                apply: {
                    label: string;
                    aria: string;
                };
                requirements_label: string;
                benefits_label: string;
            };
            jobs: {
                empty: {
                    title: string;
                    department: string;
                    general: string;
                    checkback: string;
                };
            };
            departments: {
                empty: {
                    title: string;
                    subtitle: string;
                };
            };
            open_positions: string;
            opportunities: string;
            sections: {
                whyJoinUs: {
                    title: string;
                    description: string;
                };
                openPositions: {
                    title: string;
                    noPositions: string;
                };
            };
        };
        readonly chat: {
            attachFile: string;
            cancelClose: string;
            closeChat: string;
            collapseTopics: string;
            confirmClose: string;
            connected: string;
            connecting: string;
            conversationClosed: string;
            disconnected: string;
            errorMessage: string;
            expandTopics: string;
            fileUploadError: string;
            inputPlaceholder: string;
            maxFileSize: string;
            messageInput: string;
            minimizeChat: string;
            notificationsDisabled: string;
            online: string;
            openChat: string;
            placeholder: string;
            reconnecting: string;
            selectTopic: string;
            sendMessage: string;
            supportAvatarAlt: string;
            supportTitle: string;
            talkToUs: string;
            title: string;
            typing: string;
            unsupportedFileType: string;
            welcome: string;
            welcomeMessage: string;
        };
        readonly common: {
            tryAgain: string;
            close: string;
            actions: string;
            slogan: string;
            phone: string;
            email: string;
            address: {
                city: string;
                street: string;
            };
            ui: {
                edit: string;
                loading: string;
                error: string;
                retry: string;
                close: string;
                save: string;
                cancel: string;
                confirm: string;
                delete: string;
                view: string;
                show: string;
                show_less: string;
                show_more: string;
                hide: string;
                add: string;
                remove: string;
                create: string;
                update: string;
                submit: string;
                search: string;
                select: string;
                choose: string;
                book: string;
                join: string;
                overview: string;
                notAvailable: string;
                emailPlaceholder: string;
            };
            header: {
                brand: string;
                tagline: string;
                menu: string;
                notifications: string;
                profile: string;
                settings: string;
                billing: string;
                help: string;
                login: string;
                logout: string;
                user: string;
            };
            theme: {
                dark: string;
                light: string;
                toggleTitle: string;
                moreOptions: string;
                toggleAriaLabel: string;
                switchToDark: string;
                toggle: string;
            };
            admin: {
                users_description: string;
                actions: string;
                edit: string;
                dashboard: string;
                users: string;
                blog: {
                    title: string;
                    blog_posts: string;
                    social_media: string;
                    create_new: string;
                    author: string;
                    select_author: string;
                    excerpt: string;
                    excerpt_placeholder: string;
                    content: string;
                    required_fields: string;
                    posts: string;
                    create_post: string;
                    title_placeholder: string;
                    content_placeholder: string;
                    draft: string;
                    published: string;
                    create: string;
                    existing_posts: string;
                    slug: string;
                    date: string;
                    status: string;
                };
                social: {
                    posts: string;
                    create_post: string;
                    content_placeholder: string;
                    schedule: string;
                    existing_posts: string;
                    platform: string;
                    content: string;
                    scheduled_date: string;
                    status: string;
                };
                sustainable_travel: {
                    title: string;
                    page_content: string;
                    add_initiative: string;
                    hero_title: string;
                    hero_description: string;
                    mission_statement: string;
                    initiatives: string;
                    initiative_title: string;
                    initiative_description: string;
                };
            };
            allDestinations: string;
            amazing: string;
            auth: {
                login: string;
                register: string;
                loginSuccess: string;
                logoutSuccess: string;
                loginError: string;
                registerSuccess: string;
                registerError: string;
            };
            bags: string;
            billing: {
                monthly: string;
                annually: string;
                toggleAriaLabel: string;
                defaultSave: string;
                perMonthShort: string;
                perYearShort: string;
            };
            blog: {
                title: string;
                posts: string;
                create_post: string;
                title_placeholder: string;
                content_placeholder: string;
                draft: string;
                published: string;
                create: string;
                existing_posts: string;
                slug: string;
                date: string;
                status: string;
            };
            book_now: string;
            buttons: {
                getStarted: string;
            };
            cancel: string;
            choosePlan: {
                title: string;
                description: string;
            };
            clearAll: string;
            company: {
                name: string;
                slogan: string;
                phone: string;
                email: string;
                address: {
                    city: string;
                    street: string;
                };
            };
            companyInfo: {
                name: string;
                slogan: string;
                address: string;
                phone: string;
            };
            contact: {
                info: {
                    title: string;
                    subtitle: string;
                };
                faq: {
                    title: string;
                    subtitle: string;
                    more_questions: string;
                    view_all: string;
                    items: {
                        response_time: {
                            question: string;
                            answer: string;
                        };
                        booking_changes: {
                            question: string;
                            answer: string;
                        };
                        payment_methods: {
                            question: string;
                            answer: string;
                        };
                        cancellation: {
                            question: string;
                            answer: string;
                        };
                    };
                };
            };
            contactUsButton: string;
            contactUsForMoreInfo: string;
            delete: string;
            destination1Description: string;
            destination1Name: string;
            destination2Description: string;
            destination2Name: string;
            destinationsFound: string;
            destinationsTitle: string;
            discoverUniquePlaces: string;
            dismiss: string;
            edit: string;
            exploreTheWorld: string;
            explore_now: string;
            faq: {
                title: string;
                description: string;
                q1: {
                    title: string;
                    description: string;
                };
                q2: {
                    title: string;
                    description: string;
                };
                q3: {
                    title: string;
                    description: string;
                };
                q4: {
                    title: string;
                    description: string;
                };
                q5: {
                    title: string;
                    description: string;
                    linkText: string;
                };
            };
            featured: string;
            featuredDestinations: string;
            form: {
                activities: string;
                additionalInfo: string;
                budget: string;
                dates: string;
                destinations: string;
                dietary: string;
                duration: string;
                email: string;
                groupSize: string;
                name: string;
                personalInfo: string;
                phone: string;
                specialRequests: string;
                submit: string;
                travelStyle: string;
                title: string;
                subtitle: string;
                sidePanel: {
                    title: string;
                    subtitle: string;
                    phone: string;
                    email: string;
                    address: string;
                    followUs: string;
                };
                fields: {
                    name: {
                        label: string;
                        placeholder: string;
                    };
                    email: {
                        label: string;
                        placeholder: string;
                    };
                    phone: {
                        label: string;
                        placeholder: string;
                    };
                    travelType: {
                        label: string;
                        placeholder: string;
                        options: {
                            leisure: string;
                            business: string;
                            adventure: string;
                            cultural: string;
                            romantic: string;
                            family: string;
                        };
                    };
                    subject: {
                        label: string;
                        placeholder: string;
                    };
                    message: {
                        label: string;
                        placeholder: string;
                    };
                    consent: {
                        label: string;
                        privacyLink: string;
                        and: string;
                    };
                };
            };
            free: string;
            getQuote: string;
            gridView: string;
            hero: {
                title: string;
                subtitle: string;
            };
            high: string;
            learnMore: string;
            loading: string;
            location: string;
            low: string;
            medium: string;
            mostSoughtAfter: string;
            needHelp: {
                title: string;
                description: string;
                contactSupport: string;
            };
            newsletter: {
                title: string;
                description: string;
                emailLabel: string;
                emailPlaceholder: string;
                stayUpdated: string;
                dealsAndNews: string;
                successMessage: string;
                errorMessage: string;
            };
            noDestinationsFound: string;
            ourServices: string;
            partnerships: {
                title: string;
                dg: string;
                gea: string;
                sanjotec: string;
                turismodeportugal: string;
            };
            passengers: string;
            paymentMethods: {
                transfer: string;
            };
            plans: {
                basic: {
                    name: string;
                    feature1: string;
                    feature2: string;
                    feature3: string;
                    feature4: string;
                    feature4Tooltip: string;
                    description: string;
                    cta: string;
                };
                premium: {
                    name: string;
                    feature1: string;
                    feature2: string;
                    feature3: string;
                    feature3Tooltip: string;
                    feature4: string;
                    feature5: string;
                    feature6: string;
                    description: string;
                    cta: string;
                };
                business: {
                    name: string;
                    priceSuffix: string;
                    feature1: string;
                    feature2: string;
                    feature3: string;
                    feature4: string;
                    feature5: string;
                    feature5Tooltip: string;
                    feature6: string;
                    feature7: string;
                    description: string;
                    cta: string;
                };
                popularBadge: string;
                mostPopular: string;
                bonusFeature: string;
            };
            profile: {
                personal: string;
                contact: string;
                preferences: string;
                payment: string;
                privacy: string;
                title: string;
                description: string;
                edit: string;
                account_menu: string;
                profile: string;
                admin_dashboard: string;
                logout: string;
                logout_success: string;
                newsletter: {
                    title: string;
                    subtitle: string;
                };
                newCampaign: string;
                refreshList: string;
                stats: {
                    totalSubscribers: string;
                    activeSubscribers: string;
                    totalCampaigns: string;
                    sentCampaigns: string;
                    avgOpenRate: string;
                    avgOpenRateDesc: string;
                };
                tabs: {
                    campaigns: string;
                    subscribers: string;
                    templates: string;
                    analytics: string;
                };
                tableHeaders: {
                    subject: string;
                    status: string;
                    recipients: string;
                    sentAt: string;
                    openRate: string;
                    createdAt: string;
                    email: string;
                    name: string;
                    language: string;
                    tags: string;
                    actions: string;
                };
                subscribers: {
                    title: string;
                    description: string;
                    searchPlaceholder: string;
                    noData: string;
                };
                templates: {
                    title: string;
                    description: string;
                };
                analytics: {
                    title: string;
                    description: string;
                };
                comingSoon: string;
                campaignStatus: {
                    draft: string;
                    sending: string;
                    sent: string;
                    failed: string;
                    archived: string;
                    scheduled: string;
                };
                actions: {
                    preview: string;
                    edit: string;
                    send: string;
                    sendNow: string;
                    delete: string;
                };
                subscriberStatus: {
                    active: string;
                    pending: string;
                    unsubscribed: string;
                    bounced: string;
                };
                tableFooter_one: string;
                tableFooter_other: string;
                buttons: {
                    refreshList: string;
                };
                campaigns: {
                    title: string;
                    description: string;
                    searchPlaceholder: string;
                    noData: string;
                };
                loading: string;
            };
            readyToExplore: string;
            recenter: string;
            recommendations: {
                title: string;
                loading: string;
                loadingAria: string;
                empty: string;
                typeFallback: string;
            };
            rentacar: {
                searchAndBook: string;
                location: string;
                any: string;
                carType: string;
                searchModel: string;
                searchPlaceholder: string;
                startDate: string;
                endDate: string;
                maxPrice: string;
                search: string;
                availableCars: string;
                carsFound: string;
                price: string;
                image: string;
                model: string;
                pricePerDay: string;
                totalPrice: string;
                action: string;
                bookNow: string;
                whyChooseUs: string;
                feature1: string;
                feature2: string;
                feature3: string;
                quickStats: string;
                totalCars: string;
                availableNow: string;
                locations: string;
                needHelp: string;
                contactInfo: string;
                contactSupport: string;
            };
            routeTransition: {
                loading: string;
            };
            save: string;
            search: string;
            searchDestinations: string;
            selectContinent: string;
            selectPriceRange: string;
            smartForm: {
                title: string;
                subtitle: string;
                success: {
                    title: string;
                    message: string;
                    button: string;
                };
                fields: {
                    destination: string;
                    dateFrom: string;
                    dateTo: string;
                    travelers: string;
                    travelType: string;
                    budget: string;
                    name: string;
                    phone: string;
                    email: string;
                    message: string;
                };
                placeholders: {
                    destination: string;
                    travelers: string;
                    travelType: string;
                    budget: string;
                    name: string;
                    phone: string;
                    email: string;
                    message: string;
                };
                errors: {
                    nameRequired: string;
                    emailRequired: string;
                    emailInvalid: string;
                    phoneRequired: string;
                    destinationRequired: string;
                    travelTypeRequired: string;
                    budgetRequired: string;
                };
                reset: string;
                submit: string;
                submitting: string;
            };
            social: {
                posts: string;
                create_post: string;
                content_placeholder: string;
                schedule: string;
                existing_posts: string;
                platform: string;
                content: string;
                scheduled_date: string;
                status: string;
            };
            socialMediaTitle: string;
            socials: {
                facebookUrl: string;
                instagramUrl: string;
                twitterUrl: string;
            };
            sortBy: string;
            available: string;
            booking: string;
            searching: string;
            day: string;
            days: string;
            roundTrip: string;
            returnDate: string;
            submit: string;
            sustainable_travel: {
                title: string;
                page_content: string;
                add_initiative: string;
                hero_title: string;
                hero_description: string;
                mission_statement: string;
                initiatives: string;
                initiative_title: string;
                initiative_description: string;
            };
            tableView: string;
            testimonials: {
                title: string;
                subtitle: string;
            };
            tryAdjustingFilters: string;
            video_not_supported: string;
            viewAll: string;
            nav: {
                destinations: string;
                flights: string;
                hotels: string;
                community: string;
                demo: string;
            };
            legal: {
                terms: string;
                privacy: string;
                cookies: string;
                gdpr: string;
                cancellation: string;
            };
            mobile: {
                app: string;
            };
            help: {
                documentation: string;
            };
            view_details: string;
            zoom_in: string;
            zoom_out: string;
        };
        readonly community: {
            actions: {
                like: string;
                unlike: string;
                comment: string;
                share: string;
                save: string;
                report: string;
                follow: string;
                unfollow: string;
                edit: string;
                delete: string;
                retry: string;
                reply: string;
                viewComments: string;
                hideComments: string;
                addComment: string;
                postComment: string;
            };
            tabs: {
                posts: string;
                trips: string;
                events: string;
            };
            errors: {
                like_failed: string;
                try_again: string;
                join_failed: string;
                post_create_failed: string;
            };
            success: {
                joined_trip: string;
            };
            hero: {
                title: string;
                subtitle: string;
            };
            meta: {
                title: string;
                description: string;
            };
            moderation: {
                reportPost: string;
                reportUser: string;
                reason: string;
                spam: string;
                inappropriate: string;
                harassment: string;
                other: string;
                submit: string;
                thanks: string;
            };
            notifications: {
                title: string;
                markAllRead: string;
                noNotifications: string;
                newPost: string;
                newComment: string;
                newLike: string;
                newFollower: string;
                eventReminder: string;
            };
            post: {
                like: string;
                unlike: string;
                comment: string;
                share: string;
                save: string;
                report: string;
                edit: string;
                delete: string;
                reply: string;
                viewComments: string;
                hideComments: string;
                addComment: string;
                postComment: string;
                likesCount: string;
                commentsCount: string;
                sharesCount: string;
            };
            profile: {
                posts: string;
                followers: string;
                following: string;
                follow: string;
                unfollow: string;
                message: string;
                about: string;
                joined: string;
                location: string;
                website: string;
                bio: string;
            };
            search: {
                placeholder: string;
                users: string;
                posts: string;
                groups: string;
                events: string;
                noResults: string;
                tryDifferent: string;
            };
            sections: {
                feed: {
                    title: string;
                    createPost: string;
                    placeholder: string;
                    postButton: string;
                    noContent: string;
                };
                categories: {
                    title: string;
                    all: string;
                    experiences: string;
                    tips: string;
                    photos: string;
                    reviews: string;
                    questions: string;
                    recommendations: string;
                    stories: string;
                    dev: string;
                    help: string;
                };
                posts: {
                    title: string;
                    traveler_fallback: string;
                    explorer_fallback: string;
                    recent_interaction: string;
                    view_linked_trip: string;
                    likes_count: string;
                    liked: string;
                    like: string;
                    comment_count: string;
                    back: string;
                    no_results: string;
                };
                cta: {
                    title: string;
                    description: string;
                    create_trip: string;
                    explore_posts: string;
                };
                trending: {
                    title: string;
                    destinations: string;
                    discussions: string;
                    members: string;
                };
                groups: {
                    title: string;
                    joinGroup: string;
                    createGroup: string;
                    myGroups: string;
                    discover: string;
                    members: string;
                    posts: string;
                };
                events: {
                    title: string;
                    upcoming: string;
                    past: string;
                    createEvent: string;
                    joinEvent: string;
                    interested: string;
                    going: string;
                    date: string;
                    location: string;
                    attendees: string;
                };
                leaderboard: {
                    title: string;
                    topContributors: string;
                    points: string;
                    posts: string;
                    likes: string;
                    comments: string;
                };
            };
            settings: {
                title: string;
                privacy: string;
                notifications: string;
                publicProfile: string;
                showEmail: string;
                allowMessages: string;
                emailNotifications: string;
                pushNotifications: string;
            };
        };
        readonly consent: {
            banner: {
                title: string;
                description: string;
                acceptAll: string;
                rejectAll: string;
                customize: string;
                necessary: string;
            };
            buttons: {
                customize: string;
                necessary: string;
                accept_all: string;
                save: string;
            };
            categories: {
                necessary: {
                    name: string;
                    description: string;
                    examples: {
                        session: string;
                        security: string;
                        cart: string;
                    };
                };
                functional: {
                    name: string;
                    description: string;
                    examples: {
                        language: string;
                        theme: string;
                        preferences: string;
                    };
                };
                analytics: {
                    name: string;
                    description: string;
                    examples: {
                        usage: string;
                        performance: string;
                        errors: string;
                    };
                };
                marketing: {
                    name: string;
                    description: string;
                    examples: {
                        ads: string;
                        social: string;
                        retargeting: string;
                    };
                };
            };
            compliance: {
                title: string;
                description: string;
            };
            examples: string;
            legal: {
                learnMore: string;
                privacyPolicy: string;
                cookiePolicy: string;
                dataRetention: string;
            };
            links: {
                privacy: string;
                cookies: string;
                gdpr: string;
            };
            modal: {
                title: string;
                description: string;
                save: string;
                cancel: string;
                acceptAll: string;
                rejectAll: string;
            };
            preferences: {
                title: string;
                lastUpdated: string;
                change: string;
                export: string;
                delete: string;
            };
            required: string;
        };
        readonly contact: {
            contactInfo: {
                title: string;
                address: {
                    title: string;
                    content: string;
                };
                phone: {
                    title: string;
                    content: string;
                };
                email: {
                    title: string;
                    content: string;
                };
                hours: {
                    title: string;
                    content: string;
                };
                items: {
                    icon: string;
                    title: string;
                    details: string[];
                }[];
            };
            faq: {
                title: string;
                subtitle: string;
                badge: string;
                items: {
                    question: string;
                    answer: string;
                }[];
            };
            form: {
                title: string;
                subtitle: string;
                fields: {
                    name: {
                        label: string;
                        placeholder: string;
                    };
                    email: {
                        label: string;
                        placeholder: string;
                    };
                    phone: {
                        label: string;
                        placeholder: string;
                    };
                    travelType: {
                        label: string;
                        placeholder: string;
                    };
                    subject: {
                        label: string;
                        placeholder: string;
                    };
                    message: {
                        label: string;
                        placeholder: string;
                    };
                };
                travelTypes: {
                    value: string;
                    label: string;
                }[];
                submitButton: string;
                submittingText: string;
                privacyNotice: string;
                privacyPolicyAria: string;
                gdprInfo: string;
                privacyPolicy: string;
                success: {
                    title: string;
                    message: string;
                };
            };
            hero: {
                badge: string;
                title: string;
                subtitle: string;
            };
            map: {
                title: string;
                subtitle: string;
                loading: string;
                description: string;
            };
            quickActions: {
                title: string;
                chat: string;
                call: string;
                schedule: string;
            };
            stats: {
                responseTime: string;
                rating: string;
                clients: string;
                support: string;
            };
            testimonials: {
                title: string;
                subtitle: string;
                badge: string;
                items: {
                    id: string;
                    name: string;
                    location: string;
                    rating: number;
                    comment: string;
                }[];
            };
        };
        readonly cruises: {
            cruises: string;
            destinations: {
                caribbean: string;
                caribbean_desc: string;
                mediterranean: string;
                mediterranean_desc: string;
                alaska: string;
                alaska_desc: string;
                norway: string;
                norway_desc: string;
            };
            hero: {
                title: string;
                subtitle: string;
            };
            popularDestinations: {
                title: string;
                subtitle: string;
            };
            search: {
                destination: string;
                destination_placeholder: string;
                date: string;
                cruise_line: string;
                cruise_line_placeholder: string;
                button: string;
            };
            whyChooseUs: {
                title: string;
                subtitle: string;
                exclusive: string;
                exclusive_desc: string;
                luxury: string;
                luxury_desc: string;
                support: string;
                support_desc: string;
            };
        };
        readonly dashboard: {
            dashboard: {
                title: string;
                subtitle: string;
                upcomingTrips: string;
                noUpcomingTrips: string;
                recentBookings: string;
                noRecentBookings: string;
                recommendations: string;
                noRecommendations: string;
            };
        };
        readonly demo: {
            meta: {
                title: string;
                description: string;
            };
            hero: {
                badge: string;
                title: string;
                titleHighlight: string;
                subtitle: string;
                cta: string;
                ctaSecondary: string;
                privacyNote: string;
            };
            flow: {
                title: string;
                subtitle: string;
                phases: {
                    landing: string;
                    preferences: string;
                    searching: string;
                    results: string;
                };
                phaseDescriptions: {
                    landing: string;
                    preferences: string;
                    searching: string;
                    results: string;
                };
            };
            tabs: {
                basics: {
                    title: string;
                    description: string;
                    details: string[];
                };
                budget: {
                    title: string;
                    description: string;
                    details: string[];
                };
                personalization: {
                    title: string;
                    description: string;
                    details: string[];
                };
                sustainability: {
                    title: string;
                    description: string;
                    details: string[];
                };
                model: {
                    title: string;
                    description: string;
                    details: string[];
                };
                privacy: {
                    title: string;
                    description: string;
                    details: string[];
                };
                review: {
                    title: string;
                    description: string;
                    details: string[];
                };
            };
            search: {
                title: string;
                subtitle: string;
                processing: string;
                analyzing: string;
                matching: string;
                complete: string;
                localBadge: string;
                noDataLeaves: string;
            };
            privacy: {
                sectionTitle: string;
                sectionSubtitle: string;
                localLlm: {
                    title: string;
                    description: string;
                };
                noCloud: {
                    title: string;
                    description: string;
                };
                encrypted: {
                    title: string;
                    description: string;
                };
                openSource: {
                    title: string;
                    description: string;
                };
                yourData: {
                    title: string;
                    description: string;
                };
                gdpr: {
                    title: string;
                    description: string;
                };
            };
            features: {
                sectionTitle: string;
                sectionSubtitle: string;
                aiPowered: {
                    title: string;
                    description: string;
                };
                multiTab: {
                    title: string;
                    description: string;
                };
                ecoConscious: {
                    title: string;
                    description: string;
                };
                modelChoice: {
                    title: string;
                    description: string;
                };
                privacyFirst: {
                    title: string;
                    description: string;
                };
                smartSearch: {
                    title: string;
                    description: string;
                };
            };
            cta: {
                title: string;
                subtitle: string;
                button: string;
                footnote: string;
            };
            common: {
                step: string;
                of: string;
                next: string;
                back: string;
                startOver: string;
                learnMore: string;
            };
        };
        readonly destinations: {
            allDestinations: string;
            amazing: string;
            contactUsButton: string;
            contactUsForMoreInfo: string;
            destination1Description: string;
            destination1Name: string;
            destination2Description: string;
            destination2Name: string;
            destinationsFound: string;
            destinationsTitle: string;
            discoverUniquePlaces: string;
            exploreTheWorld: string;
            featuredDestinations: string;
            mostSoughtAfter: string;
            noDestinationsFound: string;
            ourServices: string;
            readyToExplore: string;
            searchDestinations: string;
            selectContinent: string;
            selectPriceRange: string;
            service1Description: string;
            service1Name: string;
            service2Description: string;
            service2Name: string;
            tryAdjustingFilters: string;
            page: {
                featured: {
                    editorialLabel: string;
                    title: string;
                };
                results: {
                    showingPrefix: string;
                    of: string;
                    destinations: string;
                };
                countries: {
                    label: string;
                    more: string;
                };
                filters: {
                    title: string;
                };
                newsletter: {
                    eyebrow: string;
                    title: string;
                    description: string;
                };
            };
        };
        readonly errors: {
            pt: {
                "404": string;
                "500": string;
                unauthorized: string;
                forbidden: string;
                notFound: string;
                notImplemented: string;
                badGateway: string;
                "Server Error": string;
                "Service Unavailable": string;
            };
            en: string;
        };
        readonly faq: {
            answers: {
                bp_howToBook: string;
                bp_paymentMethods: string;
                bp_installments: string;
                cc_policy: string;
                cc_canIChange: string;
                dt_passport: string;
                dt_visa: string;
                dt_travelInsurance: string;
                dt_healthRequirements: string;
                ds_popularDestinations: string;
                ds_customPackages: string;
                ds_groupTravel: string;
                ds_localGuides: string;
                lc_agencyObligations: string;
                lc_travelerRights: string;
                lc_complaints: string;
                lc_rnavt: string;
                sc_contactMethods: string;
                sc_emergencySupport: string;
                sc_responseTime: string;
                sc_languages: string;
            };
            categories: {
                bookingPayment: string;
                cancellationsChanges: string;
                documentationTravel: string;
                destinationsServices: string;
                legalCompliance: string;
                supportContacts: string;
            };
            contactDetails: {
                phone: string;
                email: string;
            };
            faq: string;
            hero: {
                title: string;
                subtitle: string;
            };
            linkTexts: {
                lre: string;
            };
            noResults: string;
            notFound: {
                title: string;
                description: string;
                contactUs: string;
            };
            questions: {
                bp_howToBook: string;
                bp_paymentMethods: string;
                bp_installments: string;
                cc_policy: string;
                cc_canIChange: string;
                dt_passport: string;
                dt_visa: string;
                dt_travelInsurance: string;
                dt_healthRequirements: string;
                ds_popularDestinations: string;
                ds_customPackages: string;
                ds_groupTravel: string;
                ds_localGuides: string;
                lc_agencyObligations: string;
                lc_travelerRights: string;
                lc_complaints: string;
                lc_rnavt: string;
                sc_contactMethods: string;
                sc_emergencySupport: string;
                sc_responseTime: string;
                sc_languages: string;
            };
            searchPlaceholder: string;
        };
        readonly features: {
            categories: {
                core: string;
                advanced: string;
                premium: string;
            };
            cta: {
                title: string;
                subtitle: string;
            };
            features: {
                aiPlanning: {
                    title: string;
                    description: string;
                };
                secureBooking: {
                    title: string;
                    description: string;
                };
                globalDestinations: {
                    title: string;
                    description: string;
                };
                community: {
                    title: string;
                    description: string;
                };
                analytics: {
                    title: string;
                    description: string;
                };
            };
            subtitle: string;
            title: string;
        };
        readonly flights: {
            booking: {
                title: string;
                description: string;
                flightDetails: string;
                passengerInfo: string;
                name: string;
                email: string;
                phone: string;
                totalPrice: string;
                confirm: string;
                cancel: string;
                bookingSuccess: string;
                bookingError: string;
            };
            contactCta: {
                title: string;
                description: string;
                cta: string;
            };
            flightTypes: {
                title: string;
                subtitle: string;
                learnMore: string;
                international: {
                    title: string;
                    description: string;
                };
                domestic: {
                    title: string;
                    description: string;
                };
                group: {
                    title: string;
                    description: string;
                };
            };
            flights: {
                popular: {
                    newYork: string;
                    london: string;
                    paris: string;
                    tokyo: string;
                };
            };
            hero: {
                title: string;
                subtitle: string;
                cta: string;
            };
            popularFlights: {
                title: string;
                subtitle: string;
            };
            results: {
                title: string;
                noResults: string;
                tryDifferentSearch: string;
                loadingFlights: string;
                flightsFound: string;
                airline: string;
                departure: string;
                arrival: string;
                duration: string;
                stops: string;
                price: string;
                action: string;
                bookNow: string;
                direct: string;
                oneStop: string;
                multipleStops: string;
            };
            search: {
                title: string;
                origin: string;
                originPlaceholder: string;
                destination: string;
                destinationPlaceholder: string;
                selectDate: string;
                passenger: string;
                passengersPlural: string;
                clear: string;
                departure: string;
                departurePlaceholder: string;
                arrival: string;
                arrivalPlaceholder: string;
                departureDate: string;
                returnDate: string;
                passengers: string;
                button: string;
                searching: string;
                roundTrip: string;
                oneWay: string;
            };
        };
        readonly voos: {
            hero: {
                titulo: string;
                subtitulo: string;
                cta: string;
            };
            pesquisa: {
                idaeVolta: string;
                soIda: string;
                tipoLabel: string;
                de: string;
                para: string;
                partida: string;
                regresso: string;
                passageirosLabel: string;
                passageiro_one: string;
                passageiro_other: string;
                procurar: string;
                aProcurar: string;
                incluirAeroportos: string;
                apenasDiretos: string;
                incluirHotel: string;
                selecionarOrigem: string;
                selecionarDestino: string;
            };
            caracteristicas: {
                titulo: string;
                subtitulo: string;
                badgeDestaque: string;
                coberturaGlobal: string;
                coberturaGlobalDesc: string;
                reservaSegura: string;
                reservaSeguraDesc: string;
                pagamentosFlexiveis: string;
                pagamentosFlexiveisDesc: string;
                suporte24h: string;
                suporte24hDesc: string;
                confortoBordo: string;
                confortoBordoDesc: string;
                bagagemGenerosa: string;
                bagagemGenerosaDesc: string;
                programaFidelidade: string;
                programaFidelidadeDesc: string;
                melhoresPrecos: string;
                melhoresPrecosDesc: string;
                saibaMais: string;
                pronto: string;
                botaoBuscar: string;
            };
            faq: {
                titulo: string;
                subtitulo: string;
                pergunta1: string;
                resposta1: string;
                pergunta2: string;
                resposta2: string;
                pergunta3: string;
                resposta3: string;
                pergunta4: string;
                resposta4: string;
            };
            resultados: {
                titulo: string;
                aeroportosProximos: string;
                apenasDiretos: string;
                direto: string;
                paragens: string;
                nenhumVoo: string;
                tentarNovamente: string;
                erroDuffel: string;
                classeEconomica: string;
                origem: string;
                destino: string;
                duracao: string;
                preco: string;
                porPassageiro: string;
                classificacao: string;
                selecionado: string;
                selecionar: string;
                opcoesHotel: string;
                aProcurarHoteis: string;
                nenhumHotel: string;
                reservarHotel: string;
                avaliacoes: string;
                porNoite: string;
                airlineFallback: string;
            };
            reserva: {
                confirmarTitulo: string;
                fechar: string;
                classeEconomica: string;
                origem: string;
                destino: string;
                duracao: string;
                passageirosLabel: string;
                passageiro_one: string;
                passageiro_other: string;
                tipoViagem: string;
                idaeVolta: string;
                sóIda: string;
                caracteristicas: string;
                precoTotal: string;
                cancelar: string;
                confirmar: string;
                aConfirmar: string;
            };
            page: {
                badge: string;
                benefits: {
                    secureBooking: string;
                    fastComparison: string;
                    dedicatedSupport: string;
                };
                searchShell: {
                    eyebrow: string;
                    title: string;
                    description: string;
                };
                openMaps: {
                    title: string;
                    description: string;
                };
            };
            duffel: {
                title: string;
                subtitle: string;
                searchResults: string;
                flightCardTitle: string;
                airlineFallback: string;
                totalPrice: string;
                directFlight: string;
                flightWithStops: string;
                aircraft: string;
                flightLabel: string;
                cabinClassSuffix: string;
                noFlightsFound: string;
                loading: string;
                errorTitle: string;
                notAvailable: string;
            };
        };
        readonly footer: {
            allRightsReserved: string;
            backToTop: string;
            blogTitle: string;
            byTravelers: string;
            by_team: string;
            categories: {
                empresa: string;
                legal: string;
                ajuda: string;
                suporte: string;
                integrações: string;
            };
            company: {
                title: string;
                careers: string;
                press: string;
                sustainableTravel: string;
                community: string;
            };
            complaints: {
                title: string;
                tooltip: string;
                alt: string;
                entity: string;
            };
            cookies: string;
            description: string;
            emailPlaceholder: string;
            errorToastDescription: string;
            errorToastTitle: string;
            features: {
                security: string;
                certified: string;
                support: string;
                payments: string;
            };
            followOn: string;
            guest: {
                title: string;
                smartForm: string;
            };
            ia: {
                preferences: string;
                toggle: string;
            };
            legal: {
                security: string;
                terms: string;
                privacy: string;
                cookies: string;
                gdpr: string;
                "cancellation-policy": string;
            };
            legalInfo: string;
            legalTitle: string;
            madeWith: string;
            madeWithLove: string;
            made_with: string;
            nav: {
                dashboard: string;
                trips: string;
                bookings: string;
                profile: string;
                searchPlaceholder: string;
                quickActions: string;
                newTrip: string;
                newBooking: string;
                support: string;
                notifications: string;
                newBookingConfirmed: string;
                bookingConfirmedForLisbon: string;
                myProfile: string;
                settings: string;
                billing: string;
                help: string;
                legal: string;
            };
            newsletter: {
                placeholder: string;
                consent: string;
                subscribe: string;
            };
            newsletterDescription: string;
            newsletterPlaceholder: string;
            newsletterPrivacy: string;
            newsletterPrivacyShort: string;
            newsletterSuccess: string;
            newsletterTitle: string;
            ourServices: string;
            partnersDisclaimer: string;
            partnersTitle: string;
            partnerships: {
                title: string;
                gea: string;
                sanjotec: string;
                dg: string;
                turismodeportugal: string;
                description: string;
            };
            paymentMethods: string;
            paymentMethodsData: {
                transfer: string;
            };
            paymentMethodsTitle: string;
            policies: string;
            privacy: string;
            product: {
                title: string;
                features: string;
                pricing: string;
                integrations: string;
                api: string;
                mobile: string;
                flights: string;
                hotels: string;
                cruises: string;
                trains: string;
                buses: string;
                carRental: string;
                activities: string;
                insurance: string;
            };
            quickLinks: string;
            quickLinksTitle: string;
            resources: {
                title: string;
            };
            rights: string;
            rightsReserved: string;
            securePayments: string;
            security: string;
            services: {
                packages: string;
                hotels: string;
                flights: string;
                transfers: string;
                insurance: string;
                title: string;
                otherServices: string;
            };
            social: {
                title: string;
                links: string;
            };
            subscribeButton: string;
            subscribing: string;
            successToastDescription: string;
            successToastTitle: string;
            support: {
                title: string;
                help: string;
                documentation: string;
                status: string;
                community: string;
                technical: string;
                partnerships: string;
                howItWorks: string;
                integrations: string;
                app: string;
            };
            terms: string;
            user: {
                title: string;
                preferences: string;
                accountSettings: string;
                bookingHistory: string;
            };
            userNavigation: {
                dashboard: string;
                profile: string;
                bookings: string;
                trips: string;
                payments: string;
                settings: string;
            };
            verifiedProvider: string;
        };
        readonly gallery: {
            cta_button: string;
            cta_description: string;
            cta_title: string;
            error_loading: string;
            items_shown: string;
            no_images_found: string;
            subtitle: string;
            title: string;
            viewItemAria: string;
        };
        readonly help: {
            documentation: string;
            feedback: {
                title: string;
                yes: string;
                no: string;
                thanks: string;
                improve: string;
                submit: string;
            };
            hero: {
                title: string;
                subtitle: string;
            };
            meta: {
                title: string;
                description: string;
            };
            sections: {
                search: {
                    placeholder: string;
                    button: string;
                    noResults: string;
                    tryDifferent: string;
                };
                categories: {
                    title: string;
                    gettingStarted: {
                        title: string;
                        description: string;
                    };
                    booking: {
                        title: string;
                        description: string;
                    };
                    account: {
                        title: string;
                        description: string;
                    };
                    payments: {
                        title: string;
                        description: string;
                    };
                    technical: {
                        title: string;
                        description: string;
                    };
                    policies: {
                        title: string;
                        description: string;
                    };
                };
                faq: {
                    title: string;
                    viewAll: string;
                    questions: {
                        howToBook: {
                            question: string;
                            answer: string;
                        };
                        cancelBooking: {
                            question: string;
                            answer: string;
                        };
                        paymentMethods: {
                            question: string;
                            answer: string;
                        };
                        refunds: {
                            question: string;
                            answer: string;
                        };
                    };
                };
                contact: {
                    title: string;
                    description: string;
                    methods: {
                        chat: {
                            title: string;
                            description: string;
                            button: string;
                        };
                        email: {
                            title: string;
                            description: string;
                            address: string;
                            button: string;
                        };
                        phone: {
                            title: string;
                            description: string;
                            number: string;
                            button: string;
                        };
                    };
                };
                guides: {
                    title: string;
                    quickStart: string;
                    bookingGuide: string;
                    accountSetup: string;
                    troubleshooting: string;
                };
                status: {
                    title: string;
                    operational: string;
                    issues: string;
                    maintenance: string;
                    viewStatus: string;
                };
            };
        };
        readonly home: {
            aiFeaturesItems: {
                recommendations: {
                    title: string;
                    desc: string;
                };
                planning: {
                    title: string;
                    desc: string;
                };
                personalization: {
                    title: string;
                    desc: string;
                };
            };
            cta: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                button: string;
                title: string;
                desc: string;
                aiBtn: string;
                aiSub: string;
                placeholder: string;
                btn: string;
                privacy: string;
                stats: {
                    subscribers: string;
                    offers: string;
                    countries: string;
                    satisfaction: string;
                };
            };
            destinations: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
            };
            featuredDestinations: {
                title: string;
                subtitle: string;
                viewAllDestinations: string;
                destinations: {
                    santorini: {
                        name: string;
                        description: string;
                        badge: string;
                        price: string;
                    };
                    tokyo: {
                        name: string;
                        description: string;
                        badge: string;
                        price: string;
                    };
                    bali: {
                        name: string;
                        description: string;
                        badge: string;
                        price: string;
                    };
                };
                reviews: string;
            };
            features: {
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                ctaLabel: string;
                guaranteedSecurity: {
                    title: string;
                    description: string;
                };
                specializedGuides: {
                    title: string;
                    description: string;
                };
                support247: {
                    title: string;
                    description: string;
                };
                uniqueExperiences: {
                    title: string;
                    description: string;
                };
                cruises: {
                    title: string;
                    desc: string;
                    badge: string;
                };
                bus: {
                    title: string;
                    desc: string;
                    badge: null;
                };
                beach: {
                    title: string;
                    desc: string;
                    badge: null;
                };
                badge: {
                    popular: string;
                };
            };
            featuresAI: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                items: {
                    recommendations: {
                        title: string;
                        desc: string;
                    };
                    quickPlanning: {
                        title: string;
                        desc: string;
                    };
                    personalization: {
                        title: string;
                        desc: string;
                    };
                };
            };
            hero: {
                title: string;
                subtitle: string;
                searchPlaceholder: string;
                datePickerPlaceholder: string;
                searchButton: string;
                exploreDestinations: string;
                learnMore: string;
            };
            heroAI: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                ctaStart: string;
                ctaDemo: string;
                loading: string;
                preparingDemo: string;
                stats: string[];
            };
            home: string;
            recommendations: {
                title: string;
                subtitle: string;
            };
            stats: {
                satisfiedClients: string;
                exclusiveDestinations: string;
                satisfactionRate: string;
                supportAvailable: string;
                destinations: string;
                partners: string;
                experience: string;
                customers: string;
            };
            statsLabels: {
                destinations: string;
                travelers: string;
                rating: string;
                support: string;
            };
            testimonials: {
                badge: string;
                titlePart1: string;
                titlePart2: string;
                subtitle: string;
                ratingLabel: string;
            };
            testimonialsItems: {
                name: string;
                location: string;
                text: string;
            }[];
        };
        readonly hotels: {
            contactCta: {
                title: string;
                description: string;
                cta: string;
            };
            destinations: {
                lisbon: string;
                porto: string;
                algarve: string;
                madrid: string;
            };
            form: {
                destination: string;
                destinationPlaceholder: string;
                checkIn: string;
                checkOut: string;
                guests: string;
            };
            hero: {
                title: string;
                subtitle: string;
                cta: string;
            };
            popularDestinations: {
                title: string;
                subtitle: string;
                viewHotels: string;
                explore: string;
                error: string;
            };
            ratings: {
                wonderful: string;
                veryGood: string;
                good: string;
                pleasant: string;
                average: string;
            };
            search: {
                title: string;
                placeholder: string;
                button: string;
                destination: string;
                destinationRequired: string;
                destinationPlaceholder: string;
                checkIn: string;
                checkInRequired: string;
                checkOut: string;
                checkOutRequired: string;
                guests: string;
                selectGuests: string;
                guest: string;
            };
            filters: {
                title: string;
                freeCancellation: string;
                payAtProperty: string;
                mealPlans: string;
                propertyType: string;
                sortBy: string;
                starRating: string;
                wonderful: string;
                veryGood: string;
                good: string;
                pleasant: string;
                clear: string;
                apply: string;
                activeFilters: string;
                noActiveFilters: string;
            };
            openMaps: {
                title: string;
                description: string;
            };
            seo: {
                title: string;
                siteName: string;
                description: string;
            };
        };
        readonly insurance: {
            benefits: {
                badge: string;
                title: string;
                subtitle: string;
                learnMore: string;
                medical: {
                    title: string;
                    description: string;
                };
                cancellation: {
                    title: string;
                    description: string;
                };
                baggage: {
                    title: string;
                    description: string;
                };
                "247support": string;
                simpleProcess: string;
                priorityAssistance: string;
                specializedAssistance: string;
            };
            benefitsTitle: string;
            contact: {
                badge: string;
                title: string;
                subtitle: string;
                phone: string;
                email: string;
                chat: string;
            };
            contactCta: {
                title: string;
                description: string;
                cta: string;
            };
            coverage: {
                badge: string;
                title: string;
                subtitle: string;
                selectPlan: string;
            };
            coveragesTitle: string;
            detailedCoverages: string;
            faq: {
                title: string;
                subtitle: string;
                q1: string;
                a1: string;
                q2: string;
                a2: string;
                q3: string;
                a3: string;
            };
            features: {
                medicalExpenses: string;
                personalAccidents: string;
                luggageLoss: string;
                flightCancellation: string;
                tripInterruption: string;
                personalLiability: string;
                extremeSports: string;
                searchAndRescue: string;
                childCareAssistance: string;
                familyPackageDiscounts: string;
            };
            finePrint: string;
            form: {
                title: string;
                destination: string;
                destinationPlaceholder: string;
                startDate: string;
                endDate: string;
                travelers: string;
                age: string;
                loading: string;
                validation: {
                    required: string;
                    dateRange: string;
                };
                errors: {
                    generic: string;
                };
            };
            generalBenefits: string;
            getQuoteButton: string;
            hero: {
                title: string;
                subtitle: string;
                cta: string;
            };
            products: {
                title: string;
                subtitle: string;
                basic: {
                    name: string;
                    description: string;
                    summary: string;
                    price: string;
                    finePrint: string;
                };
                premium: {
                    name: string;
                    description: string;
                    summary: string;
                    price: string;
                    badge: string;
                    finePrint: string;
                };
                adventure: {
                    name: string;
                    description: string;
                    summary: string;
                    price: string;
                    finePrint: string;
                };
                family: {
                    name: string;
                    description: string;
                    summary: string;
                    price: string;
                    finePrint: string;
                };
            };
            viewDetails: string;
            whyChooseUs: {
                title: string;
                subtitle: string;
                badge: string;
                feature1_title: string;
                feature1_desc: string;
                feature2_title: string;
                feature2_desc: string;
                feature3_title: string;
                feature3_desc: string;
            };
        };
        readonly language: {
            current: string;
            select: string;
        };
        readonly legal: {
            terms: string;
            privacy: string;
            cookies: string;
            gdpr: string;
            cancellation: string;
            cancellationPage: {
                hero: {
                    title: string;
                    subtitle: string;
                };
                sectionPolicy: {
                    title: string;
                    intro: string;
                    sections: ({
                        title: string;
                        points: string[];
                        periods?: undefined;
                    } | {
                        title: string;
                        points: string[];
                        periods: {
                            period: string;
                            fee: string;
                        }[];
                    })[];
                    important: {
                        title: string;
                        description: string;
                    };
                };
                sectionHowTo: {
                    title: string;
                    steps: {
                        title: string;
                        description: string;
                        icon: string;
                    }[];
                };
                sectionFaq: {
                    title: string;
                    questions: {
                        q: string;
                        a: string;
                    }[];
                };
                needHelp: {
                    title: string;
                    description: string;
                };
                contactSupport: {
                    title: string;
                    description: string;
                    button: string;
                };
                myBookings: {
                    title: string;
                    description: string;
                    button: string;
                };
                ui: {
                    loading: string;
                    refundTimeline: {
                        title: string;
                        description: string;
                    };
                    howToHint: string;
                };
            };
            cookiesPage: {
                title: string;
                lastUpdated: string;
                introduction: string;
                ui: {
                    readingProgressAria: string;
                    privacyCenterBadge: string;
                    aboutThisPolicy: string;
                };
                sections: {
                    whatAreCookies: {
                        title: string;
                        content: {
                            type: string;
                            text: string;
                        }[];
                    };
                    typesOfCookies: {
                        title: string;
                        content: {
                            type: string;
                            items: string[];
                        }[];
                    };
                    manageCookies: {
                        title: string;
                        content: {
                            type: string;
                            text: string;
                        }[];
                    };
                };
            };
            gdprPage: {
                hero: {
                    title: string;
                    subtitle: string;
                };
                lastUpdated: string;
                ui: {
                    compliantBadge: string;
                    lastUpdated: string;
                    navigationTitle: string;
                    quickActionsTitle: string;
                    contactDpo: string;
                    exerciseRights: string;
                    nav: {
                        introduction: string;
                        dataCategories: string;
                        dataController: string;
                        dataProcessing: string;
                        dataTypes: string;
                        userRights: string;
                        dataSecurity: string;
                        contact: string;
                    };
                };
                intro: string;
                sections: {
                    dataController: {
                        title: string;
                        content: string;
                        contact: {
                            name: string;
                            email: string;
                            phone: string;
                            address: string;
                        };
                    };
                    dataProcessing: {
                        title: string;
                        purposes: {
                            title: string;
                            description: string;
                            legalBasis: string;
                        }[];
                    };
                    dataTypes: {
                        title: string;
                        categories: {
                            category: string;
                            examples: string[];
                            retention: string;
                        }[];
                    };
                    rights: {
                        title: string;
                        userRights: {
                            right: string;
                            description: string;
                        }[];
                    };
                    dataSecurity: {
                        title: string;
                        measures: string[];
                    };
                    dataTransfers: {
                        title: string;
                        content: string;
                        safeguards: string[];
                    };
                    cookies: {
                        title: string;
                        content: string;
                        linkText: string;
                    };
                    contact: {
                        title: string;
                        content: string;
                        dpoContact: string;
                    };
                };
                effectiveDate: string;
            };
            hero: {
                title: string;
                lastUpdated: string;
                terms: string;
                privacy: string;
                cookies: string;
                cancellation: string;
                responsibility: string;
                gdpr: string;
            };
            privacyPage: {
                title: string;
                lastUpdated: string;
                ui: {
                    badge: string;
                    updatedLabel: string;
                    applicableLabel: string;
                    printVersion: {
                        title: string;
                        description: string;
                        download: string;
                    };
                    intro: string;
                    contactDpo: string;
                    backToTopAria: string;
                };
                sections: {
                    introduction: {
                        title: string;
                        content: {
                            type: string;
                            text: string;
                        }[];
                    };
                    dataWeCollect: {
                        title: string;
                        content: ({
                            type: string;
                            text: string;
                            items?: undefined;
                        } | {
                            type: string;
                            items: string[];
                            text?: undefined;
                        })[];
                    };
                    howWeUseAI: {
                        title: string;
                        content: ({
                            type: string;
                            text: string;
                            items?: undefined;
                        } | {
                            type: string;
                            items: string[];
                            text?: undefined;
                        })[];
                    };
                    dataSharing: {
                        title: string;
                        content: ({
                            type: string;
                            text: string;
                            items?: undefined;
                        } | {
                            type: string;
                            items: string[];
                            text?: undefined;
                        })[];
                    };
                    yourRights: {
                        title: string;
                        content: ({
                            type: string;
                            text: string;
                            items?: undefined;
                        } | {
                            type: string;
                            items: string[];
                            text?: undefined;
                        })[];
                    };
                };
            };
            sections: string;
            termsPage: {
                title: string;
                lastUpdated: string;
                introduction: string;
                sections: {
                    object: {
                        title: string;
                        content: {
                            type: string;
                            text: string;
                        }[];
                    };
                    bookingProcess: {
                        title: string;
                        content: ({
                            type: string;
                            text: string;
                            items?: undefined;
                        } | {
                            type: string;
                            items: string[];
                            text?: undefined;
                        })[];
                    };
                    aiUsage: {
                        title: string;
                        content: ({
                            type: string;
                            text: string;
                            items?: undefined;
                        } | {
                            type: string;
                            items: string[];
                            text?: undefined;
                        })[];
                    };
                    cancellations: {
                        title: string;
                        content: {
                            type: string;
                            text: string;
                        }[];
                    };
                    responsibilities: {
                        title: string;
                        content: {
                            type: string;
                            text: string;
                        }[];
                    };
                    dataProtection: {
                        title: string;
                        content: {
                            type: string;
                            text: string;
                        }[];
                    };
                };
            };
        };
        readonly loading: {
            admin: string;
            adminDashboard: string;
            auth: string;
            default: string;
            publicPage: string;
            user: string;
            userDashboard: string;
        };
        readonly localGuides: {
            becomeAGuide: string;
            becomeGuide: {
                title: string;
                description: string;
                applyNow: string;
                feature1: {
                    title: string;
                    desc: string;
                };
                feature2: {
                    title: string;
                    desc: string;
                };
                feature3: {
                    title: string;
                    desc: string;
                };
            };
            clearFilters: string;
            contactUs: string;
            ctaSubtitle: string;
            detailsPanel: {
                about: string;
                tours: string;
                moreInfo: string;
                memberSince: string;
                bookTour: string;
                noTours: string;
                languages: string;
                specialties: string;
                experienceYears: string;
                certifications: string;
                basePrice: string;
                hour: string;
                contactGuideCta: string;
            };
            discoverOur: string;
            expertise: {
                todos: string;
                trilhas: string;
                culturalocal: string;
                gastronomia: string;
                vidanoturna: string;
                arteurbana: string;
                mercadoslocais: string;
            };
            experts: string;
            faqLink: string;
            filterPlaceholder: string;
            filters: {
                title: string;
                clear: string;
                searchLabel: string;
                searchPlaceholder: string;
                locationLabel: string;
                allLocations: string;
                specialtyLabel: string;
                allSpecialties: string;
                languageLabel: string;
                allLanguages: string;
            };
            guideListSubtitle: string;
            guides: {
                guide_1: {
                    bio: string;
                    tagline: string;
                    tour_title: string;
                    tour_desc: string;
                };
                guide_2: {
                    bio: string;
                    tagline: string;
                    tour_title: string;
                    tour_desc: string;
                };
            };
            guidesList: {
                title: string;
                sortBy: string;
                sortOptions: {
                    rating: string;
                    name: string;
                    experience: string;
                    price: string;
                };
                verified: string;
                reviews: string;
                reviews_plural: string;
                experience: string;
                experience_plural: string;
                viewProfile: string;
                noResultsTitle: string;
                noResultsDesc: string;
            };
            hero: {
                badge: string;
                title: string;
                subtitle: string;
            };
            heroSubtitle: string;
            localGuides: string;
            meetOur: string;
            noGuidesFound: string;
            ourGuidesBadge: string;
            readyToExplore: string;
            searchLabel: string;
            searchPlaceholder: string;
            specialties: {
                história: string;
                gastronomia: string;
                natureza: string;
                arquitetura: string;
            };
            page: {
                titlePrefix: string;
                titleHighlight: string;
                loadingExperts: string;
                guidesAvailable: string;
                emptyState: {
                    title: string;
                    description: string;
                    clearAll: string;
                };
                cta: {
                    title: string;
                    subtitle: string;
                    primary: string;
                    secondary: string;
                };
            };
        };
        readonly mobile: {
            app: {
                app: string;
            };
            cta: {
                title: string;
                subtitle: string;
                ios: string;
                android: string;
            };
            features: {
                title: string;
                subtitle: string;
                offlineMaps: {
                    title: string;
                    desc: string;
                };
                pushNotifications: {
                    title: string;
                    desc: string;
                };
                offlineSync: {
                    title: string;
                    desc: string;
                };
                cameraIntegration: {
                    title: string;
                    desc: string;
                };
                gpsNavigation: {
                    title: string;
                    desc: string;
                };
                secureStorage: {
                    title: string;
                    desc: string;
                };
            };
            hero: {
                appLabel: string;
                appStore: string;
                googlePlay: string;
            };
            reviews: {
                title: string;
                subtitle: string;
                maria: {
                    comment: string;
                };
                joao: {
                    comment: string;
                };
                ana: {
                    comment: string;
                };
            };
            screenshots: {
                title: string;
                subtitle: string;
                explore: {
                    title: string;
                    desc: string;
                };
                plan: {
                    title: string;
                    desc: string;
                };
                book: {
                    title: string;
                    desc: string;
                };
            };
            stats: {
                downloads: string;
                rating: string;
                activeUsers: string;
                countries: string;
            };
        };
        readonly nav: {
            about: string;
            activities: string;
            auth: {
                login: string;
                register: string;
            };
            blog: string;
            blogMenu: {
                allPosts: string;
                sustainableTravel: string;
            };
            booking: string;
            community: string;
            contact: string;
            cruzeiros: string;
            cruises: string;
            destinations: string;
            faq: string;
            flights: string;
            gallery: string;
            home: string;
            hotels: string;
            integrations: string;
            language: {
                en: string;
                pt: string;
                es: string;
                fr: string;
                label: string;
            };
            login: string;
            map: string;
            menu: string;
            mobileNavigation: string;
            bottom_nav: string;
            dashboard: string;
            trips: string;
            bookings: string;
            profile: string;
            searchPlaceholder: string;
            quickActions: string;
            newTrip: string;
            newBooking: string;
            support: string;
            notifications: string;
            newBookingConfirmed: string;
            bookingConfirmedForLisbon: string;
            myProfile: string;
            settings: string;
            billing: string;
            help: string;
            search: string;
            account: string;
            openMenu: string;
            packages: string;
            planYourTrip: string;
            poweredByAI: string;
            preferences: string;
            register: string;
            rent_a_car: string;
            services: string;
            servicesList: {
                packages: string;
                hotels: string;
                flights: string;
                transfers: string;
                cruises: string;
                localGuides: string;
                insurance: string;
                all: string;
                ferries: string;
                trains: string;
                rent_a_car: string;
                buses: string;
                activities: string;
            };
            smartForm: string;
            sustainable: string;
            userMenu: {
                profile: string;
                settings: string;
                dashboard: string;
                logout: string;
                billing: string;
                help: string;
            };
            userNavigation: {
                dashboard: string;
                trips: string;
                bookings: string;
                profile: string;
                payments: string;
                settings: string;
            };
        };
        readonly newsletter: {
            description: string;
            emailPlaceholder: string;
            error: {
                invalidTitle: string;
                invalidDesc: string;
            };
            subscribeButton: string;
            subscribing: string;
            success: {
                title: string;
                desc: string;
            };
            title: string;
        };
        readonly notifications: {
            empty: string;
            error: string;
            info: string;
            markAll: string;
            success: string;
            title: string;
            toggle: string;
            unread: string;
            urgent: string;
            viewAll: string;
            warning: string;
        };
        readonly packages: {
            benefits: {
                title: string;
                description: string;
                security: {
                    title: string;
                    description: string;
                };
                bestPrices: {
                    title: string;
                    description: string;
                };
                support: {
                    title: string;
                    description: string;
                };
                flexible: {
                    title: string;
                    description: string;
                };
            };
            customCta: {
                title: string;
                description: string;
                cta: string;
            };
            featuredPackages: {
                title: string;
                description: string;
                filters: string;
                filtersTitle: string;
            };
            filters: {
                type: string;
                destination: string;
                selectDestination: string;
                duration: string;
                selectDuration: string;
                priceRange: string;
                apply: string;
            };
            header: {
                title: string;
                searchPlaceholder: string;
                contact: string;
                filters: string;
                filtersTitle: string;
            };
            hero: {
                title: string;
                subtitle: string;
                cta: string;
                viewDeals: string;
            };
            packageTypes: {
                title: string;
                description: string;
                explore: string;
                romantic: {
                    title: string;
                    description: string;
                    feature1: string;
                    feature2: string;
                    price: string;
                };
                family: {
                    title: string;
                    description: string;
                    feature1: string;
                    feature2: string;
                    price: string;
                };
                adventure: {
                    title: string;
                    description: string;
                    feature1: string;
                    feature2: string;
                    price: string;
                };
                gastronomic: {
                    title: string;
                    description: string;
                    feature1: string;
                    feature2: string;
                    price: string;
                };
                luxury: {
                    title: string;
                    description: string;
                };
                wellness: {
                    title: string;
                    description: string;
                };
                "group-travel": {
                    title: string;
                    description: string;
                };
                "cultural-exchange": {
                    title: string;
                    description: string;
                };
                "photography-tourism": {
                    title: string;
                    description: string;
                };
                "snow-sports": {
                    title: string;
                    description: string;
                };
                "corporate-travel": {
                    title: string;
                    description: string;
                };
                "coastal-tourism": {
                    title: string;
                    description: string;
                };
            };
            packages: {
                reviews: string;
                details: string;
                bookNow: string;
                included: string;
                more: string;
            };
            page: {
                hero: {
                    title: string;
                    subtitle: string;
                };
                error: {
                    title: string;
                    message: string;
                    retry: string;
                };
                empty: {
                    title: string;
                    message: string;
                };
                unknown: string;
                onRequest: string;
                brand: string;
                featured: string;
                categoryBanner: {
                    title: string;
                    subtitle: string;
                    cta: string;
                };
                stats: {
                    packages: string;
                    destinations: string;
                    categories: string;
                    averageRating: string;
                    na: string;
                };
                schema: {
                    collectionName: string;
                    collectionDescription: string;
                    breadcrumbHome: string;
                    breadcrumbPackages: string;
                    organizationName: string;
                    organizationDescription: string;
                };
            };
        };
        readonly payments: {
            actions: {
                menu: string;
                options: string;
                configure: string;
                viewProvider: string;
                activate: string;
                deactivate: string;
                delete: string;
                clickToActivate: string;
                clickToDeactivate: string;
            };
            addMethod: string;
            currency: {
                free: string;
            };
            description: string;
            dialog: {
                addTitle: string;
                editTitle: string;
                addDescription: string;
                editDescription: string;
                fields: {
                    methodName: string;
                    methodNamePlaceholder: string;
                    provider: string;
                    providerPlaceholder: string;
                    feesDescription: string;
                    feesPlaceholder: string;
                    activeMethod: string;
                };
                buttons: {
                    cancel: string;
                    saving: string;
                    saveChanges: string;
                    addMethod: string;
                };
            };
            messages: {
                methodsLoaded: string;
                loadError: string;
                loadErrorDescription: string;
                validationError: string;
                nameRequired: string;
                updateSuccess: string;
                methodUpdated: string;
                methodAdded: string;
                saveError: string;
                saveErrorDescription: string;
                statusUpdated: string;
                statusUpdateError: string;
                deleteConfirm: string;
                methodDeleted: string;
                deleteError: string;
            };
            stats: {
                activeMethods: string;
                activeMethodsDescription: string;
                averageFee: string;
                averageFeeDescription: string;
                mostPopular: string;
                mostPopularValue: string;
                mostPopularDescription: string;
                nextReview: string;
                nextReviewValue: string;
                nextReviewDescription: string;
            };
            status: {
                ativo: string;
                inativo: string;
                em_configuracao: string;
            };
            table: {
                title: string;
                description: string;
                searchPlaceholder: string;
                tabs: {
                    all: string;
                    active: string;
                    inactive: string;
                };
                headers: {
                    name: string;
                    provider: string;
                    status: string;
                    fees: string;
                    availableIn: string;
                    lastUpdated: string;
                    actions: string;
                };
                noMethods: string;
                global: string;
            };
            title: string;
        };
        readonly preferences: {
            loading: {
                initializing: string;
            };
            header: {
                title: string;
                description: string;
            };
            tabs: {
                travelProfile: string;
                aiBehavior: string;
                aiEngine: string;
                privacy: string;
                analytics: string;
            };
            activities: {
                beaches: string;
                adventure: string;
                culture: string;
                gastronomy: string;
                nightlife: string;
                nature: string;
                photography: string;
                shopping: string;
                wellness: string;
            };
            budget: string;
            budgetOptions: {
                select: string;
                "500-1000": string;
                "1000-3000": string;
                "3000-5000": string;
                "5000+": string;
            };
            comments: string;
            departureDate: string;
            destination: string;
            destinations: {
                europe: string;
                asia: string;
                northAmerica: string;
                southAmerica: string;
                africa: string;
                oceania: string;
                caribbean: string;
                middleEast: string;
            };
            duration: string;
            durationOptions: {
                select: string;
                weekend: string;
                week: string;
                "2weeks": string;
                month: string;
            };
            email: string;
            errorGeneratingTrip: string;
            errorSavingFeedback: string;
            feedbackSaved: string;
            generateTrip: string;
            generating: string;
            interests: string;
            interestsEnum: {
                ADVENTURE: string;
                CULTURE: string;
                RELAXATION: string;
                NATURE: string;
                GASTRONOMY: string;
            };
            itinerary: string;
            name: string;
            nextMonth: string;
            nextQuarter: string;
            nextWeek: string;
            placeholders: {
                groupSize: string;
                dietary: string;
                specialRequests: string;
            };
            planningSection: string;
            provideFeedback: string;
            quickSelection: string;
            rating: string;
            returnDate: string;
            selectDepartureDate: string;
            selectInterest: string;
            selectReturnDate: string;
            selectSustainability: string;
            submit: string;
            submitFeedback: string;
            submitting: string;
            subtitle: string;
            success: string;
            successDescription: string;
            sustainability: string;
            sustainabilityEnum: {
                LOW: string;
                MEDIUM: string;
                HIGH: string;
            };
            title: string;
            travelDates: string;
            travelStyles: {
                luxury: string;
                adventure: string;
                budget: string;
            };
            travelers: string;
            tripGenerated: string;
            validation: {
                nameRequired: string;
                emailInvalid: string;
                budgetPositive: string;
                durationPositive: string;
                travelersMin: string;
            };
            yourTripProposal: string;
        };
        readonly press: {
            hero: {
                badge: string;
                title: string;
                subtitle: string;
                contactPress: string;
                pressKit: string;
            };
            releases: {
                title: string;
                subtitle: string;
                filterLabel: string;
                featured: string;
                readMore: string;
                noResults: string;
                noResultsTitle: string;
                viewArchive: string;
            };
            mediaKit: {
                title: string;
                subtitle: string;
                download: string;
            };
            contact: {
                title: string;
                subtitle: string;
            };
            meta: {
                title: string;
                description: string;
            };
        };
        readonly pricing: {
            billing: {
                monthly: string;
                annually: string;
                toggleAriaLabel: string;
                defaultSave: string;
                perYearShort: string;
                perMonthShort: string;
            };
            choosePlan: {
                title: string;
                description: string;
            };
            faq: {
                title: string;
                description: string;
                q1: {
                    title: string;
                    description: string;
                };
                q2: {
                    title: string;
                    description: string;
                };
                q3: {
                    title: string;
                    description: string;
                };
                q4: {
                    title: string;
                    description: string;
                };
                q5: {
                    title: string;
                    description: string;
                    linkText: string;
                };
            };
            free: string;
            hero: {
                title: string;
                subtitle: string;
            };
            plans: {
                mostPopular: string;
                popularBadge: string;
                bonusFeature: string;
                basic: {
                    name: string;
                    description: string;
                    cta: string;
                    feature1: string;
                    feature2: string;
                    feature3: string;
                    feature4: string;
                    feature4Tooltip: string;
                };
                premium: {
                    name: string;
                    description: string;
                    cta: string;
                    annualSave: string;
                    feature1: string;
                    feature2: string;
                    feature3: string;
                    feature3Tooltip: string;
                    feature4: string;
                    feature5: string;
                    feature6: string;
                };
                business: {
                    name: string;
                    description: string;
                    cta: string;
                    priceSuffix: string;
                    annualSave: string;
                    feature1: string;
                    feature2: string;
                    feature3: string;
                    feature4: string;
                    feature5: string;
                    feature5Tooltip: string;
                    feature6: string;
                    feature7: string;
                };
            };
        };
        readonly profile: {
            profile: {
                title: string;
                subtitle: string;
                personalInfo: string;
                updateYourInfo: string;
                form: {
                    firstName: string;
                    lastName: string;
                    email: string;
                    phone: string;
                    location: string;
                    bio: string;
                    required: string;
                    invalidEmail: string;
                };
                saveChanges: string;
                successMessage: string;
                security: string;
                notifications: string;
                preferences: string;
                completeness: string;
                complete: string;
                save_changes: string;
                info_updated: string;
                unexpected_error: string;
                personal: string;
                contact: string;
                payment: string;
                privacy: string;
                admin: {
                    dashboard: string;
                    users: string;
                    settings: {
                        title: string;
                    };
                    blog: string;
                    sustainable_travel: string;
                };
                verification: {
                    email_verified: string;
                    phone_not_verified: string;
                };
                admin_panel: string;
                admin_panel_description: string;
                admin_panel_instruction: string;
                personal_data: {
                    title: string;
                    description: string;
                    first_name: string;
                    last_name: string;
                    email: string;
                    phone: string;
                    date_of_birth: string;
                    nationality: string;
                    tax_id: string;
                    gender: string;
                    gender_female: string;
                    gender_male: string;
                    marital_status: string;
                    marital_status_married: string;
                    marital_status_single: string;
                };
                address: {
                    title: string;
                    description: string;
                    street: string;
                    number: string;
                    complement: string;
                    neighborhood: string;
                    city: string;
                    state: string;
                    postal_code: string;
                    country: string;
                };
                travel_preferences: {
                    title: string;
                    description: string;
                    preferred_currency: string;
                };
                payment_methods: {
                    title: string;
                    description: string;
                    no_payment_methods: string;
                    add_payment_method: string;
                    add_payment_method_button: string;
                };
                privacy_settings: {
                    title: string;
                    description: string;
                    profile_visibility: string;
                    show_email: string;
                    show_email_description: string;
                    show_phone: string;
                    show_phone_description: string;
                    show_address: string;
                    show_address_description: string;
                };
                notificationsSection: {
                    title: string;
                    marketing_emails: string;
                    marketing_emails_description: string;
                    sms_notifications: string;
                    sms_notifications_description: string;
                    push_notifications: string;
                    push_notifications_description: string;
                };
                data_sharing: {
                    title: string;
                    share_with_partners: string;
                    share_with_partners_description: string;
                };
                securitySection: {
                    title: string;
                    current_password: string;
                    new_password: string;
                    confirm_new_password: string;
                    change_password: string;
                    passwords_dont_match: string;
                    password_updated: string;
                    invalid_password: string;
                };
                account: {
                    title: string;
                    delete_account: string;
                    delete_confirm: string;
                    account_deleted: string;
                };
            };
        };
        readonly profilepreferences: {
            budget: string;
            duration: string;
            group_size: string;
            payment_methods: string;
            preferred_currency: string;
            preferred_language: string;
            select_budget: string;
            select_duration: string;
            select_payment_method: string;
            title: string;
            travel_preferences: string;
        };
        readonly register: {
            account_created_success: string;
            agree_cancellation: string;
            agree_cookies: string;
            agree_gdpr: string;
            agree_privacy: string;
            agree_responsibility: string;
            agree_terms: string;
            already_have_account: string;
            and: string;
            benefit_1: string;
            benefit_2: string;
            benefit_3: string;
            by_creating_account: string;
            cancellation_policy: string;
            confirm_password: string;
            confirm_your_password: string;
            continue_with_facebook: string;
            continue_with_google: string;
            cookie_policy: string;
            create_account: string;
            create_account_button: string;
            create_password: string;
            creating_account: string;
            email: string;
            error_creating_account: string;
            fill_required_fields: string;
            first_name: string;
            form: {
                accept_terms: string;
                accept_privacy: string;
                accept_cookies: string;
                newsletter: string;
                terms_of_service: string;
                privacy_policy: string;
                cookie_policy: string;
            };
            gdpr_policy: string;
            last_name: string;
            login_link: string;
            medium: string;
            or: string;
            password: string;
            password_strength: string;
            passwords_dont_match: string;
            phone: string;
            privacy_policy: string;
            required_field: string;
            responsibility_terms: string;
            sign_in: string;
            strong: string;
            subscribe_newsletter: string;
            subtitle: string;
            terms_of_service: string;
            title: string;
            unexpected_error: string;
            weak: string;
            welcome: string;
        };
        readonly rentacar: {
            action: string;
            any: string;
            availableCars: string;
            availableNow: string;
            bookNow: string;
            carType: string;
            carsFound: string;
            contactInfo: string;
            contactSupport: string;
            endDate: string;
            feature1: string;
            feature2: string;
            feature3: string;
            image: string;
            location: string;
            locations: string;
            maxPrice: string;
            model: string;
            needHelp: string;
            price: string;
            pricePerDay: string;
            quickStats: string;
            search: string;
            searchAndBook: string;
            searchModel: string;
            searchPlaceholder: string;
            startDate: string;
            subtitle: string;
            titlePart1: string;
            titlePart2: string;
            totalCars: string;
            totalPrice: string;
            whyChooseUs: string;
        };
        readonly search: {
            filters: {
                title: string;
                clear: string;
                type: {
                    title: string;
                    destinations: string;
                    hotels: string;
                    packages: string;
                    attractions: string;
                    restaurants: string;
                };
                price: {
                    title: string;
                };
                rating: {
                    title: string;
                    any: string;
                };
            };
            header: {
                exploreOffers: string;
            };
            results: {
                count: string;
                featured: string;
                types: {
                    destination: string;
                    transfer: string;
                    restaurant: string;
                    cruise: string;
                    attraction: string;
                    package: string;
                    hotel: string;
                    flight: string;
                };
                reviews: string;
                noReviews: string;
                perWhat: {
                    vehicle: string;
                    experience: string;
                    guest: string;
                    person: string;
                    night: string;
                };
                viewDetails: string;
            };
            sort: {
                placeholder: string;
                relevance: string;
                priceLow: string;
                priceHigh: string;
                ratingHigh: string;
                nameAZ: string;
            };
            view: {
                list: string;
                map: string;
            };
        };
        readonly services: {
            benefits: {
                title: string;
                subtitle: string;
                items: string[];
            };
            contactUsButton: string;
            contactUsForCustomSolution: string;
            cta: {
                title: string;
                subtitle: string;
                buttons: {
                    quote: string;
                    destinations: string;
                };
            };
            hero: {
                badge: string;
                title: string;
                subtitle: string;
            };
            mainServices: {
                title: string;
                subtitle: string;
                popularBadge: string;
                ctaButton: string;
                items: {
                    packages: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    flights: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    hotels: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    transfers: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    cruises: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    localGuides: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    insurance: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    ferries: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    trains: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    rentACar: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    buses: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                    activities: {
                        title: string;
                        price: string;
                        description: string;
                        features: string[];
                        popular: string;
                    };
                };
            };
            ourComprehensiveServices: string;
            process: {
                title: string;
                subtitle: string;
                items: {
                    step1: {
                        title: string;
                        description: string;
                    };
                    step2: {
                        title: string;
                        description: string;
                    };
                    step3: {
                        title: string;
                        description: string;
                    };
                    step4: {
                        title: string;
                        description: string;
                    };
                };
            };
            readyToGetStarted: string;
            service1Description: string;
            service1Name: string;
            service2Description: string;
            service2Name: string;
            service3Description: string;
            service3Name: string;
            service4Description: string;
            service4Name: string;
            servicesTitle: string;
            specializedServices: {
                title: string;
                subtitle: string;
                ctaButton: string;
                items: {
                    honeymoon: {
                        title: string;
                        description: string;
                    };
                    groupTravel: {
                        title: string;
                        description: string;
                    };
                    culturalExchange: {
                        title: string;
                        description: string;
                    };
                    photoTourism: {
                        title: string;
                        description: string;
                    };
                    snow: {
                        title: string;
                        description: string;
                    };
                    corporate: {
                        title: string;
                        description: string;
                    };
                    coastal: {
                        title: string;
                        description: string;
                    };
                };
            };
        };
        readonly settings: {
            settings: {
                title: string;
                subtitle: string;
                notifications: string;
                notificationsDescription: string;
                disable: string;
                enable: string;
                language: string;
                languageDescription: string;
                dangerZone: string;
                dangerZoneDescription: string;
                deleteAccount: string;
                notificationTypes: {
                    email: string;
                    push: string;
                    sms: string;
                };
                notificationDescriptions: {
                    email: string;
                    push: string;
                    sms: string;
                };
            };
        };
        readonly 'smart-form': {
            basics: {
                header: {
                    title: string;
                    subtitle: string;
                };
                completion: {
                    allDone: string;
                    progress: string;
                };
                aria: {
                    progressBar: string;
                    done: string;
                    pending: string;
                    stepStatus: string;
                };
                groups: {
                    whereWhen: {
                        label: string;
                        description: string;
                    };
                    whoHow: {
                        label: string;
                        description: string;
                    };
                    travelType: {
                        label: string;
                        description: string;
                    };
                };
                sections: {
                    destination: {
                        title: string;
                        subtitle: string;
                    };
                    dates: {
                        title: string;
                        subtitle: string;
                    };
                    travelers: {
                        title: string;
                        subtitle: string;
                    };
                    language: {
                        title: string;
                        subtitle: string;
                    };
                };
            };
            budget: {
                header: {
                    title: string;
                    subtitle: string;
                };
                categories: {
                    accommodation: string;
                    food: string;
                    activities: string;
                    transport: string;
                    shopping: string;
                    emergency: string;
                    travelInsurance: string;
                };
                settings: {
                    title: string;
                    subtitle: string;
                    currency: string;
                    durationDays: string;
                };
                savings: {
                    title: string;
                    subtitle: string;
                    amount: string;
                    progress: string;
                    savedOf: string;
                    total: string;
                };
                tips: {
                    title: string;
                    subtitle: string;
                    emergencyBuffer: {
                        title: string;
                        body: string;
                    };
                    dailySpending: {
                        title: string;
                        body: string;
                        bodyWithSuggestion: string;
                    };
                    savingsStrategy: {
                        title: string;
                        good: string;
                        improve: string;
                    };
                };
                overview: {
                    totalBudget: {
                        label: string;
                        perDay: string;
                    };
                    savingsGoal: {
                        label: string;
                        percentOfTotal: string;
                    };
                    tripDuration: {
                        label: string;
                        value: string;
                        extended: string;
                        short: string;
                    };
                };
                aria: {
                    sidebar: string;
                };
            };
            personalization: {
                title: string;
                description: string;
                banner: {
                    noPreferences: string;
                    noActivities: string;
                    ready: string;
                    count: string;
                };
                sections: {
                    travelPreferences: {
                        title: string;
                        subtitle: string;
                    };
                    activities: {
                        title: string;
                        subtitle: string;
                    };
                };
            };
        };
        readonly support: {
            agents: {
                title: string;
                subtitle: string;
                rating: string;
                responseTime: string;
                specialties: string;
                languages: string;
                startChat: string;
                offline: string;
                online: string;
            };
            articles: {
                title: string;
                subtitle: string;
                readTime: string;
                views: string;
                updated: string;
                readArticle: string;
                difficulty: {
                    beginner: string;
                    intermediate: string;
                    advanced: string;
                };
            };
            channels: {
                title: string;
                subtitle: string;
                liveChat: string;
                email: string;
                phone: string;
                videoCall: string;
                contact: string;
                unavailable: string;
                availability: string;
                responseTime: string;
                languages: string;
            };
            common: {
                loading: string;
                error: string;
                success: string;
                cancel: string;
                save: string;
                close: string;
                back: string;
                next: string;
                previous: string;
            };
            emergency: {
                title: string;
                subtitle: string;
                phone: string;
                emergencyChat: string;
            };
            faq: {
                title: string;
                subtitle: string;
                helpful: string;
                views: string;
                viewMore: string;
                categories: {
                    all: string;
                    bookings: string;
                    api: string;
                    payments: string;
                    account: string;
                    mobile: string;
                    security: string;
                };
            };
            hero: {
                title: string;
                subtitle: string;
            };
            search: {
                placeholder: string;
                noResults: string;
                resultsFound: string;
            };
            stats: {
                avgResponseTime: string;
                satisfactionRate: string;
                articlesAvailable: string;
                supportAgents: string;
            };
            tabs: {
                faq: string;
                articles: string;
                ticket: string;
                agents: string;
            };
            ticket: {
                title: string;
                subtitle: string;
                form: {
                    name: string;
                    email: string;
                    subject: string;
                    category: string;
                    priority: string;
                    description: string;
                    attachments: string;
                    submit: string;
                    submitting: string;
                    selectCategory: string;
                    selectPriority: string;
                    dragFiles: string;
                    maxFiles: string;
                };
                categories: {
                    technical: string;
                    billing: string;
                    account: string;
                    feature: string;
                    other: string;
                };
                priorities: {
                    low: string;
                    medium: string;
                    high: string;
                    urgent: string;
                };
            };
        };
        readonly sustainable: {
            articles: {
                readMore: string;
            };
            page: {
                hero: {
                    title: string;
                    subtitle: string;
                };
                commitment: {
                    title: string;
                    subtitle: string;
                    pillars: {
                        icon: string;
                        title: string;
                        description: string;
                        colorClass: string;
                    }[];
                };
                practices: {
                    title: string;
                    subtitle: string;
                    items: {
                        id: string;
                        icon: string;
                        title: string;
                        description: string;
                        points: string[];
                    }[];
                };
                articles: {
                    title: string;
                    subtitle: string;
                    items: {
                        title: string;
                        excerpt: string;
                        image: string;
                        category: string;
                        date: string;
                        slug: string;
                    }[];
                    readMore: string;
                    cta: string;
                };
                joinMovement: {
                    title: string;
                    description: string;
                    mainCta: string;
                    secondaryCta: string;
                };
                callToAction: string;
            };
        };
        readonly terms: {
            responsibility: {
                title: string;
                subtitle: string;
                lastUpdated: string;
                effectiveDate: string;
                introduction: string;
                sections: {
                    liability: {
                        title: string;
                        intro: string;
                        scope: string;
                        exclusions: string[];
                    };
                    client: {
                        title: string;
                        intro: string;
                        items: string[];
                    };
                    company: {
                        title: string;
                        intro: string;
                        items: string[];
                    };
                    insurance: {
                        title: string;
                        intro: string;
                        coverage: string[];
                        company: string;
                    };
                    disputes: {
                        title: string;
                        intro: string;
                        procedure: string[];
                        jurisdiction: string;
                    };
                };
            };
            error: {
                title: string;
                message: string;
                retry: string;
            };
            terms: {
                lastUpdated: string;
                effective: string;
                version: string;
                download: string;
                print: string;
            };
            footer: {
                newsletter: {
                    title: string;
                    description: string;
                    placeholder: string;
                    success: string;
                    error: string;
                };
                contact: {
                    title: string;
                };
                legal: {
                    title: string;
                };
                compliance: {
                    title: string;
                };
                governed: string;
                questions: string;
                rights: string;
                secure: string;
                verified: string;
                transparent: string;
            };
        };
        readonly testimonials: {
            listTitle: string;
            quotePrefix: string;
            quoteSuffix: string;
            rating: string;
            subtitle: string;
            title: string;
            feedbackLabel: string;
            noReviews: string;
            totalReviews: string;
            averageRating: string;
            verified: string;
            featured: string;
            fallback: {
                comments: string[];
                trips: string[];
            };
        };
        readonly theme: {
            accessibility: {
                themeToggle: string;
                currentTheme: string;
                themeMenu: string;
                closeMenu: string;
            };
            "admin-dark": string;
            adminDark: string;
            adminLight: string;
            auto: string;
            autoActive: string;
            current: string;
            dark: string;
            interfaceTitle: string;
            light: string;
            moreOptions: string;
            nightSchedule: string;
            settings: {
                title: string;
                description: string;
                autoMode: string;
                autoModeDescription: string;
                manualMode: string;
                manualModeDescription: string;
            };
            simpleMode: string;
            toggleAria: string;
            toggleTitle: string;
            user: string;
            userDark: string;
            userLight: string;
        };
        readonly transfer: {
            bookingForm: {
                title: string;
                description: string;
                from: string;
                from_placeholder: string;
                to: string;
                to_placeholder: string;
                button: string;
            };
            cta: {
                title: string;
                description: string;
                button: string;
            };
            fleet: {
                title: string;
                subtitle: string;
                vehicle: {
                    sedan: string;
                    sedan_desc: string;
                    executive: string;
                    executive_desc: string;
                    van: string;
                    van_desc: string;
                };
            };
            hero: {
                title: string;
                subtitle: string;
            };
            howItWorks: {
                title: string;
                subtitle: string;
                step1_title: string;
                step1_desc: string;
                step2_title: string;
                step2_desc: string;
                step3_title: string;
                step3_desc: string;
            };
        };
        readonly transfers: {
            bookingForm: {
                title: string;
                description: string;
                from: string;
                from_placeholder: string;
                to: string;
                to_placeholder: string;
                date: string;
                pickADate: string;
                time: string;
                button: string;
            };
            cta: {
                title: string;
                description: string;
                button: string;
                additionalInfo: string;
            };
            fleet: {
                title: string;
                subtitle: string;
                vehicle: {
                    sedan: string;
                    sedan_desc: string;
                    executive: string;
                    executive_desc: string;
                    van: string;
                    van_desc: string;
                };
            };
            hero: {
                title: string;
                subtitle: string;
            };
            howItWorks: {
                title: string;
                subtitle: string;
                step1: {
                    title: string;
                    description: string;
                };
                step2: {
                    title: string;
                    description: string;
                };
                step3: {
                    title: string;
                    description: string;
                };
            };
            toast: {
                noResultsTitle: string;
                description: string;
            };
            vehicle: {
                sedan: string;
                executive: string;
                van: string;
                sedan_desc: string;
                executive_desc: string;
                van_desc: string;
            };
        };
        readonly 'traveler-profile': {
            profile: {
                title: string;
                completeness: {
                    title: string;
                    complete: string;
                    incomplete: string;
                    progress: string;
                    completeItem: string;
                    items: {
                        profile_photo: string;
                        phone: string;
                        documents: string;
                        emergency_contact: string;
                        ai_preferences: string;
                        travel_preferences: string;
                        payment_methods: string;
                        address: string;
                    };
                };
            };
            documents: {
                title: string;
                subtitle: string;
                add: string;
                addTitle: string;
                addDescription: string;
                noDocuments: string;
                fields: {
                    type: string;
                    number: string;
                    issueDate: string;
                    expiryDate: string;
                    issuer: string;
                };
                types: {
                    passport: string;
                    national_id: string;
                    visa: string;
                    drivers_license: string;
                    travel_pass: string;
                };
                status: {
                    valid: string;
                    expiring_soon: string;
                    expired: string;
                    needs_verification: string;
                };
                verified: string;
                issued: string;
                expires: string;
                expiresIn: string;
                upload: string;
                delete: string;
            };
            emergencyContact: {
                title: string;
                subtitle: string;
                add: string;
                addTitle: string;
                addDescription: string;
                noContacts: string;
                fields: {
                    name: string;
                    relationship: string;
                    phone: string;
                    email: string;
                };
                relationships: {
                    spouse: string;
                    parent: string;
                    sibling: string;
                    child: string;
                    friend: string;
                    other: string;
                };
                primary: string;
                delete: string;
            };
            stats: {
                title: string;
                subtitle: string;
                totalTrips: string;
                countries: string;
                cities: string;
                daysTraveled: string;
                milesTraveled: string;
                reviews: string;
                averageRating: string;
                upcomingTrips_one: string;
                upcomingTrips_other: string;
                favoriteDestination: string;
            };
            badges: {
                title: string;
                earned: string;
                nextBadges: string;
                types: {
                    first_trip: {
                        name: string;
                        description: string;
                    };
                    explorer: {
                        name: string;
                        description: string;
                    };
                    world_traveler: {
                        name: string;
                        description: string;
                    };
                    early_booker: {
                        name: string;
                        description: string;
                    };
                    sustainable_traveler: {
                        name: string;
                        description: string;
                    };
                    reviewer: {
                        name: string;
                        description: string;
                    };
                    loyal_customer: {
                        name: string;
                        description: string;
                    };
                    adventure_seeker: {
                        name: string;
                        description: string;
                    };
                    culture_enthusiast: {
                        name: string;
                        description: string;
                    };
                    beach_lover: {
                        name: string;
                        description: string;
                    };
                    mountain_explorer: {
                        name: string;
                        description: string;
                    };
                    city_hopper: {
                        name: string;
                        description: string;
                    };
                    foodie_traveler: {
                        name: string;
                        description: string;
                    };
                    budget_savvy: {
                        name: string;
                        description: string;
                    };
                    luxury_traveler: {
                        name: string;
                        description: string;
                    };
                };
            };
            tabs: {
                personal: string;
                travel: string;
                preferences: string;
            };
            actions: {
                save: string;
                cancel: string;
                edit: string;
                delete: string;
                add: string;
            };
        };
    };
};
export type Resources = typeof resources;
export type Language = keyof Resources;
export { en, es, fr, pt };
export * from './types';
