
import { Entity } from "game/entities/entity";

export interface Projectile{
	parent: Entity
	collidesWithParent: boolean
	collidesWithSibling: boolean
	dispose(): void
}