import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)

    const categoryBreakdown = transactions.reduce<Record<string, number>>((acc, t) => {
      if (t.category) {
        acc[t.category.name] = (acc[t.category.name] || 0) + t.amount
      }
      return acc
    }, {})

    const remainingBudget = totalIncome - totalExpenses

    return NextResponse.json({
      totalBudget: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
      categoryBreakdown,
      recentTransactions: transactions.slice(0, 5),
      remainingBudget
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}