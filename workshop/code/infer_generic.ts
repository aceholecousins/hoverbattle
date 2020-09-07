export type NodeKind<T> =
	T extends SceneNode<infer K> ? K:
	T extends SceneNodeConfig< infer K> ? K:
	never