import prisma from "@/lib/prisma";
import { ChallengeType } from "@prisma/client";

async function seedBonPlans() {
    const data = [
        {
            id: "1",
            title: "Tech Jungle",
            description: "Un magasin spécialisé dans les produits technologiques et électroniques.",
            location: "1 Avenue Monji Slim, Menzel Bourguiba 7050",
            city: "bizerte menzel bourguiba",
            image: "/images/deals/tech-jungle.png",
            categories: ["Shopping", "Electronics"],
        },
        {
            id: "2",
            title: "Tutti Verdi",
            description: "Un supermarché moderne offrant une large gamme de produits frais et bio.",
            location: "Avenue Habib Bourguiba, Menzel Bourguiba, Tunisie",
            city: "bizerte menzel bourguiba",
            image: "/images/deals/tutti-verdi.jpg",
            categories: ["Shopping"],
        },
        {
            id: "3",
            title: "Tacos",
            description: "Dégustez des tacos savoureux dans un cadre convivial.",
            location: "Av. de L'independance, Menzel Bourguiba 7050",
            city: "bizerte menzel bourguiba",
            image: "/images/deals/tacos.jpg",
            categories: ["Food & Dining"],
        },
        {
            id: "4",
            title: "Lotus",
            description: "Un lieu idéal pour les amateurs de pâtisseries et de café.",
            location: "5Q4V+6J8, rue de la république, Menzel Bourguiba", 
            city: "bizerte menzel bourguiba",
    
            image: "/images/deals/lotus.jpeg",
            categories: ["Food & Dining"],
        },
        {
            id: "5",
            title: "Cinéma Métropole",
            description: "Découvrez les derniers films dans un cinéma moderne.",
            location: "Rue Avicenne, Menzel Bourguiba 7050",
            city: "bizerte menzel bourguiba",
    
            image: "/images/deals/cinema.jpg",
            categories: ["Entertainment"],
        },
        {
            id: "7",
            title: "Aroubi",
            description: "Un restaurant proposant des pizzas et d'autres plats délicieux.",
            location: "4QXR+H39, Menzel Bourguiba", 
            city: "bizerte menzel bourguiba",
            image: "/images/deals/aroubi.png", 
            categories: ["Food & Dining"],
        },
        
    ];

    await prisma.bonPlan.createMany({ data });
    console.log(" BonPlan Data Seeded correctly");
}

async function seedChallenges() {
    const data = [
        {
            id: "1",
            title: "Save 100 DT",
            description: "Save 100 DT this month to build your emergency fund.",
            type: ChallengeType.SAVINGS,
            goal: 100,
            duration: 30,
            reward: "A sense of financial security!",
        },
        {
            id: "2",
            title: "Save 50 DT",
            description: "Spend less than 50 DT on dining out this month.",
            type: ChallengeType.SPENDING_REDUCTION,
            goal: 50,
            duration: 30,
            reward: "Save money and cook more at home!",
        },
        {
            id: "3",
            title: "500 DT Savings Challenge",
            description: "Save 500 DT over the next 3 months for investment.",
            type: ChallengeType.SAVINGS, // Enum value
            goal: 500,
            duration: 90,
            reward: "Achieve your financial goals!"
        },
        {
            id: "4",
            title: "Reduce Grocery Spending",
            description: "Cut your grocery bill by 30 DT this month by planning meals and avoiding unplanned buys.",
            type: ChallengeType.SPENDING_REDUCTION,
            goal: 30,
            duration: 30,
            reward: "Save money and waste less food!",
        },
        {
            id: "5",
            title: "Save for a Rainy Day",
            description: "Save 200 DT over the next 2 months for unexpected expenses.",
            type: ChallengeType.SAVINGS,
            goal: 200,
            duration: 60,
            reward: "Be prepared for life's surprises!",
        },
        {
            id: "6",
            title: "Reduce Online Shopping",
            description: "Cut your online shopping expenses by 60 DT this month.",
            type: ChallengeType.SPENDING_REDUCTION,
            goal: 60,
            duration: 30,
            reward: "Save money and avoid unnecessary purchases!",
        },
     

    ];

    await prisma.challenge.createMany({ data });
    console.log(" Challenges Data Seeded correctly");
}

async function main() {
    try {
        console.log("🗑 Deleting existing data...");
        await prisma.review.deleteMany(); // Suppression des données dépendantes
        await prisma.bonPlan.deleteMany();
        await prisma.challenge.deleteMany();

        console.log(" Seeding new data...");
        await seedBonPlans();
        await seedChallenges();

        console.log("é Seeding completed!");
    } catch (error) {
        console.error(" Error seeding data:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
