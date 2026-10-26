// tests/test_mobile_carousel_and_palette.mjs
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

function testCarouselAndPalette() {
  console.log('🧪 Verifying Mobile Feature Carousel & Premium White Palette...\n');

  const pagePath = path.resolve('src/app/page.tsx');
  const carouselPath = path.resolve('src/components/home/AppleFeatureCarousel.tsx');
  const cssPath = path.resolve('src/app/globals.css');
  const valueStackPath = path.resolve('src/components/home/ValueStackSection.tsx');

  const pageCode = fs.readFileSync(pagePath, 'utf8');
  const carouselCode = fs.readFileSync(carouselPath, 'utf8');
  const cssCode = fs.readFileSync(cssPath, 'utf8');
  const valueStackCode = fs.readFileSync(valueStackPath, 'utf8');

  // 1. Premium White Palette Verification
  assert(
    pageCode.includes('bg-[#FBFBFA]'),
    'Page must use premium off-white #FBFBFA canvas'
  );
  assert(
    !pageCode.includes('bg-[#FDFDFD]'),
    'Raw flat #FDFDFD should be replaced with premium white'
  );
  assert(
    cssCode.includes('background-color: #FBFBFA;'),
    'globals.css body must use #FBFBFA'
  );
  assert(
    pageCode.includes('bg-[#F5F5F7]'),
    '#caracteristicas or #pricing must use Apple signature light gray #F5F5F7'
  );
  assert(
    valueStackCode.includes('bg-[#FBFBFA]'),
    'ValueStackSection must use #FBFBFA'
  );
  console.log('✅ 1. Premium White Palette (#FBFBFA / #F5F5F7) verified.');

  // 2. Uniform Dimensions in "Todo lo que necesitas" Carousel
  assert(
    carouselCode.includes('w-[85vw] max-w-[340px] sm:w-[350px] md:w-[360px] lg:w-[370px]'),
    'Carousel cards must have uniform responsive width across all 5 cards'
  );
  assert(
    carouselCode.includes('h-[515px] sm:h-[530px]'),
    'Carousel cards must have strictly uniform height across all 5 cards'
  );
  assert(
    carouselCode.includes('h-[195px] sm:h-[205px]'),
    'Carousel mockup preview must have strictly uniform height across all 5 cards'
  );
  console.log('✅ 2. Uniform Card Dimensions (Equal height & width, zero jumping) verified.');

  // 3. Complete Visibility on Mobile & Touch Scrolling
  assert(
    carouselCode.includes('overflow-x-auto') && carouselCode.includes('snap-x'),
    'Carousel must support horizontal touch swipe snapping on mobile'
  );
  assert(
    carouselCode.includes('onScroll={handleScroll}'),
    'Carousel must sync touch scroll with StepPlayer'
  );
  assert(
    carouselCode.includes('scrollToCard'),
    'Carousel must support smooth programmatic card centering'
  );
  console.log('✅ 3. Mobile Touch Swiping & StepPlayer synchronization verified.');

  // 4. All 5 Feature Cards Present with Rich Previews
  const expectedCards = ['checkout', 'multilink', 'qr', 'payment', 'analytics'];
  for (const cardId of expectedCards) {
    assert(
      carouselCode.includes(`id: '${cardId}'`),
      `Card ${cardId} missing from CAROUSEL_CARDS`
    );
  }
  console.log('✅ 4. All 5 Feature Cards (checkout, multilink, qr, payment, analytics) verified.');

  console.log('\n🎉 ALL CAROUSEL & PALETTE TESTS PASSED 100%!');
}

testCarouselAndPalette();
