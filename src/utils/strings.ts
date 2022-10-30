export function resolveInitials(name: string) {
  return name.split(' ').map((part) => part.at(0)?.toUpperCase()).join('');
}
