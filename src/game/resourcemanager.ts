let resourceList: Promise<void>[] = []

export function addResource(resource: string, resourceFactory: () => Promise<void>) {
    resourceList.push(resourceFactory())
}

export async function loadAllResources() {
    await Promise.all(resourceList)
}