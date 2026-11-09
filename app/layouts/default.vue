<template>
  <div class="site-shell">
    <LayoutSiteHeader />
    <main id="main-content" tabindex="-1">
      <slot />
    </main>
    <LayoutSiteFooter />
  </div>
</template>
