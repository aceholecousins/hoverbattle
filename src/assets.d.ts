//This is necessary in order to avoid typescript complaining about the webpack import way
declare module "*.html" {
	const content: any;
	export default content;
}
declare module "*.css" {
	const content: any;
	export default content;
}
declare module "*.svg" {
	const content: any;
	export default content;
}
declare module "*.png" {
	const content: any;
	export default content;
}
declare module "*.jpg" {
	const content: any;
	export default content;
}