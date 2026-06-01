export const navItems = [
    { title: "Home", href: "/" },

    {
        title: "Quote",
        items: [
            { title: "Create Quote", href: "/quote" },
            { title: "Create Spot Quote", href: "/spot-quote" },
            { title: "Quotes Dashboard", href: "/quotes" },
        ],
    },

    {
        title: "Ship",
        items: [
            { title: "Create Shipment", href: "/shipment" },
        ],
    },

    {
        title: "Track",
        items: [
            { title: "Tracking Dashboard", href: "/track" },
            { title: "Pickups Dashboard", href: "/pickups" },
        ],
    },

    {
        title: "Invoices",
        items: [
            { title: "Invoice Dashboard", href: "/invoices" },
            // { title: "Search Shipment Charges", href: "/payments" },
            // reporting
            { title: "Reporting", href: "/reporting" },
        ],
    },

    {
        title: "Claims",
        items: [
            { title: "Claims Dashboard", href: "/claims" },
            { title: "Submit New Claim", href: "/claims/file" },
        ],
    },
]

export const superAdminNavItems = [
    { title: "Add Surcharges", href: "/track" },
    { title: "Claims", href: "/claims" },
]