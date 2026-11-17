function provinceOf(place: string) {
  const splitAt = place.lastIndexOf(', ')
  return splitAt === -1 ? null : place.slice(splitAt + 2)
}

export function locationChipGroups(places: string[]) {
  const groups: { label: string; places: string[] }[] = []
  const wards = new Map<string, string[]>()
  for (const place of places) {
    const province = provinceOf(place)
    if (!province) {
      groups.push({ label: place, places: [place] })
      continue
    }
    const list = wards.get(province) ?? []
    list.push(place)
    wards.set(province, list)
  }
  for (const [province, list] of wards) {
    if (list.length >= 4) groups.push({ label: `${province} · ${list.length} phường/xã`, places: list })
    else list.forEach((place) => groups.push({ label: place, places: [place] }))
  }
  return groups
}

export function placeSummary(places: string[]) {
  const labels = locationChipGroups(places).map((group) => group.label)
  if (labels.length <= 2) return labels.join(', ')
  return `${labels.length} địa điểm`
}
