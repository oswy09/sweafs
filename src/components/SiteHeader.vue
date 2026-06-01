<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

type NavLink = {
  label: string;
  href: string;
  cta?: boolean;
};

defineProps<{
  logo: {
    label: string;
    accent: string;
  };
  links: NavLink[];
  topContact: {
    phoneLabel: string;
    phoneHref: string;
    emailLabel: string;
    emailHref: string;
  };
}>();

const menuOpen = ref(false);
const scrolled = ref(false);
const MOBILE_BREAKPOINT = 680;

const updateScrollState = () => {
  scrolled.value = window.scrollY > 40;
};

const closeMobile = () => {
  menuOpen.value = false;
};

const toggleMobile = () => {
  menuOpen.value = !menuOpen.value;
};

const handleResize = () => {
  if (window.innerWidth > MOBILE_BREAKPOINT) {
    closeMobile();
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeMobile();
  }
};

const handleOutsideClick = (event: MouseEvent) => {
  if (!menuOpen.value) {
    return;
  }

  const target = event.target as Node | null;
  const nav = document.getElementById('navbar');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!target || !nav || !mobileMenu) {
    return;
  }

  if (!nav.contains(target) && !mobileMenu.contains(target)) {
    closeMobile();
  }
};

const handleScroll = () => {
  updateScrollState();

  if (menuOpen.value) {
    closeMobile();
  }
};

onMounted(() => {
  updateScrollState();
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleResize, { passive: true });
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="top-contact">
    <div class="top-contact-inner">
      <a class="top-contact-pill" :href="topContact.emailHref" data-content-href-path="topContact.emailHref">
        <i class="bi bi-envelope-fill" aria-hidden="true"></i>
        <span data-content-path="topContact.emailLabel">{{ topContact.emailLabel }}</span>
      </a>
      <a class="top-contact-pill" :href="topContact.phoneHref" data-content-href-path="topContact.phoneHref">
        <i class="bi bi-telephone-fill" aria-hidden="true"></i>
        <span data-content-path="topContact.phoneLabel">{{ topContact.phoneLabel }}</span>
      </a>
    </div>
  </div>

  <nav id="navbar" :class="{ scrolled }">
    <a href="#hero" class="nav-logo"><span class="nav-logo-main" data-content-path="logo.label">{{ logo.label }}</span> <span data-content-path="logo.accent">{{ logo.accent }}</span></a>
    <ul class="nav-links">
      <li v-for="(link, index) in links" :key="link.href">
        <a
          :href="link.href"
          :class="{ 'nav-cta': link.cta }"
          :data-content-path="`navigation.${index}.label`"
          :data-content-href-path="`navigation.${index}.href`"
        >{{ link.label }}</a>
      </li>
    </ul>
    <button
      class="hamburger"
      type="button"
      :aria-label="menuOpen ? 'Stäng meny' : 'Öppna meny'"
      :aria-expanded="menuOpen"
      aria-controls="mobileMenu"
      @click="toggleMobile"
    >
      <span></span><span></span><span></span>
    </button>
  </nav>

  <div id="mobileMenu" class="mobile-menu" :class="{ open: menuOpen }">
    <a
      v-for="(link, index) in links"
      :key="link.href"
      :href="link.href"
      :class="{ 'nav-cta': link.cta }"
      :data-content-path="`navigation.${index}.label`"
      :data-content-href-path="`navigation.${index}.href`"
      @click="closeMobile"
    >
      {{ link.label }}
    </a>
  </div>
</template>