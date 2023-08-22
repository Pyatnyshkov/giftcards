export function escapeName(name: string): string {
	name = name.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
	name = name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	return name;
}
