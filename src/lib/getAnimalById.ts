import { prisma } from "./prisma"
import { Animal } from "./types"

export const getAnimalById = async (id: number): Promise<Animal | null> => {
    const animal: Animal | null = await prisma.animal.findUnique({ where: { id: id }})

    return animal;
}