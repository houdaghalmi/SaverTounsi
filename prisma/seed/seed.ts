import prisma from "@/lib/prisma";
import { ChallengeType } from "@prisma/client";

async function seedBonPlans() {
    const data = [{
        id: "1",
        title: "Tech Jungle",
        description: "Un magasin spécialisé dans les produits technologiques et électroniques.",
        location: "1 Avenue Monji Slim, Menzel Bourguiba 7050", // Coordonnées GPS
        city: "bizerte menzel bourguiba",
        image: "/images/deals/tech-jungle.png", // Image de Tech Jungle
        categories: ["Shopping", "Electronics"],
    },
    {
        id: "2",
        title: "Tutti Verdi",
        description: "Un supermarché moderne offrant une large gamme de produits frais et bio.",
        location: "Avenue Habib Bourguiba, Menzel Bourguiba, Tunisie",
        city: "bizerte menzel bourguiba ",
        image: "/images/deals/tutti-verdi.jpg", // Image de Tutti Verte
        categories: ["Shopping"],
    },
    {
        id: "3",
        title: "Tacos",
        description: "Dégustez des tacos savoureux dans un cadre convivial.",
        location: "Av. de L'independance, Menzel Bourguiba 7050", // Adresse physique
        city: "bizerte menzel bourguiba",

        image: "/images/deals/tacos.jpg",
        categories: ["Food & Dining"],
    },
    {
        id: "4",
        title: "Lotus",
        description: "Un lieu idéal pour les amateurs de pâtisseries et de café.",
        location: "5Q4V+6J8, rue de la république, Menzel Bourguiba", // Adresse physique
        city: "bizerte menzel bourguiba",

        image: "/images/deals/lotus.jpeg",
        categories: ["Food & Dining"],
    },
    {
        id: "5",
        title: "Cinéma Métropole",
        description: "Découvrez les derniers films dans un cinéma moderne.",
        location: "Rue Avicenne, Menzel Bourguiba 7050", // Adresse physique
        city: "bizerte menzel bourguiba",

        image: "/images/deals/cinema.jpg",
        categories: ["Entertainment"],
    },
    {
        id: "7",
        title: "Aroubi",
        description: "Un restaurant proposant des pizzas et d'autres plats délicieux.",
        location: "4QXR+H39, Menzel Bourguiba", // Coordonnées GPS
        city: "bizerte menzel bourguiba",
        image: "/images/deals/aroubi.png", // Image de Aroubi
        categories: ["Food & Dining"],
    },
    ]

    await prisma.bonPlan.createMany({
        data
    })
    console.log("BonPlan Data Seeded correctly")
}
console.log("Seeding BonPlan Data")
async function mainBonPlan (){
    await prisma.bonPlan.deleteMany()
    seedBonPlans()
}
mainBonPlan()
async function seedchallenges() {
    const data = [
        {
            id: "1",
            title: "Save 100 DT",
            description: "Save 100 DT this month to build your emergency fund.",
            type: ChallengeType.SAVINGS, // Enum value
            goal: 100,
            duration: 30,
            reward: "A sense of financial security!"
        },
        {
            id: "2",
            title: "Save 50 DT",
            description: "Spend less than 50 DT on dining out this month.",
            type: ChallengeType.SPENDING_REDUCTION, // Enum value
            goal: 50,
            duration: 30,
            reward: "Save money and cook more at home!"
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
            title: "No Coffee Shops for a Week",
            description: "Avoid buying coffee from cafes for 7 days and save money.",
            type:ChallengeType.NO_SPEND, // Enum value
            goal: 0,
            duration: 7,
            reward: "Save money and discover homemade coffee!"
        }
    ]

    await prisma.challenge.createMany({
        data
    })
    console.log("challenges Data Seeded correctly")
}
console.log("Seeding challenges Data")
async function main (){
    await prisma.challenge.deleteMany()
    seedchallenges()
}
main()