import { defineEventHandler } from 'h3'

interface SavedBoard {
    id: string
    title: string
    description: string
    icon: string
    color: string
    createdAt: string
    panels: any[]
}

export default defineEventHandler(() => {
    const boards: SavedBoard[] = [

    ]

    return boards
})