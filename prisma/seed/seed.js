"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = require("@/lib/prisma");
function seedBonPlans() {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = [{
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
                    ];
                    return [4 /*yield*/, prisma_1.default.bonPlan.createMany({
                            data: data
                        })];
                case 1:
                    _a.sent();
                    console.log("BonPlan Data Seeded correctly");
                    return [2 /*return*/];
            }
        });
    });
}
console.log("Seeding BonPlan Data");
seedBonPlans();
