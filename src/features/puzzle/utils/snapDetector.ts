/**
 * Yüksek hassasiyetli ve kullanıcı dostu Snap (Mıknatıs) Algoritması.
 * Özellikle 64 parça gibi küçük parçalarda parmak kalınlığını tolere eder.
 */
export function isNearTarget(
  dropX: number,
  dropY: number,
  targetX: number,
  targetY: number,
  pieceWidth: number,
  pieceHeight: number
): boolean {
  // 1. Hedef yuvanın tam merkezi
  const targetCenterX = targetX + pieceWidth / 2;
  const targetCenterY = targetY + pieceHeight / 2;

  // 2. Merkezler arası mesafe
  const dx = dropX - targetCenterX;
  const dy = dropY - targetCenterY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Cömert ve keyifli tolerans: Parça genişliğinin 1.25 katı veya en az 55 piksel!
  const tolerance = Math.max(pieceWidth * 1.25, 55);

  if (distance <= tolerance) {
    return true;
  }

  // 3. Genişletilmiş Kutu (Bounding Box) Kontrolü
  // Parmağın ucu hedef yuvanın veya çevresinin içindeyse anında kabul et
  const padding = Math.max(pieceWidth * 0.5, 25);
  const isInExpandedBox =
    dropX >= targetX - padding &&
    dropX <= targetX + pieceWidth + padding &&
    dropY >= targetY - padding &&
    dropY <= targetY + pieceHeight + padding;

  return isInExpandedBox;
}
