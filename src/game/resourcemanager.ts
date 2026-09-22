const resources: Resource<any>[] = []

let loadedResources = false

export class Resource<T> {
	private value!: T

	constructor(private promise: Promise<T>) {
		if (loadedResources) {
			throw new Error("resources already loaded")
		}

		resources.push(this)
	}

	async load() {
		this.value = await this.promise
	}

	get(): T {
		if (!loadedResources) {
			throw new Error("resources have not been loaded yet")
		}

		return this.value
	}
}

export async function loadAllResources() {
	await Promise.all(
		resources.map(resource => resource.load())
	)

	loadedResources = true
}
