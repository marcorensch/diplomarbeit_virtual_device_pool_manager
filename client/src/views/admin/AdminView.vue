<template>
  <div class="admin-view">
    <div class="uk-section uk-section-small uk-padding-remove-bottom">
      <div class="uk-container">
        <div
          class="nxd-background-horizon uk-border-rounded horizontal-submenu-container"
        >
          <nav>
            <template v-for="link of adminRouterLinks" :key="link.path">
              <router-link :to="link.path">{{ link.label }} </router-link>
            </template>
            <div class="animation start-home"></div>
          </nav>
        </div>
      </div>
    </div>
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
export default {
  name: "AdminView",
  data() {
    return {
      auth: useAuthStore(),
      adminRouterLinks: [
        {
          label: "Dashboard",
          path: "/admin",
        },
        {
          label: "MSISDN Manager",
          path: "/admin/msisdn-manager",
        },
        {
          label: "Account Manager",
          path: "/admin/accounts",
        },
        {
          label: "Pool Builder",
          path: "/admin/pool-builder",
        },
        {
          label: "GuideMe Manager",
          path: "/admin/guideme-manager",
        },
      ],
    };
  },
  mounted() {
    this.setNavPosition();

    const navElements = document.querySelectorAll("nav a");
    for (const navElement of navElements) {
      navElement.addEventListener("click", (e) => {
        e.preventDefault();
        this.animateNav(e);
      });
    }
  },
  methods: {
    setNavPosition() {
      const navElements = document.querySelectorAll("nav a");
      for (const navElement of navElements) {
        if (navElement.classList.contains("router-link-exact-active")) {
          const navAnimation = document.querySelector(".animation");
          const navAnimationWidth = navElement.offsetWidth;
          const navAnimationLeft = navElement.offsetLeft;
          navAnimation.style.width = navAnimationWidth + "px";
          navAnimation.style.left = navAnimationLeft + "px";
        }
      }
    },
    animateNav(e) {
      const target = e.target;
      const navAnimation = document.querySelector(".animation");
      const navAnimationWidth = target.offsetWidth;
      const navAnimationLeft = target.offsetLeft;
      navAnimation.style.width = navAnimationWidth + "px";
      navAnimation.style.left = navAnimationLeft + "px";
    },
  },
};
</script>

<style lang="less">
@import "@/assets/less/variables.less";
.horizontal-submenu-container {
  padding: 4px;
  nav {
    margin: 0;
    position: relative;
    height: 40px;
    border-radius: @nxd-border-radius;
    font-size: 0;
  }
  nav a {
    line-height: 40px;
    height: 100%;
    font-size: 16px;
    display: inline-block;
    position: relative;
    z-index: 1;
    text-decoration: none;
    text-align: center;
    color: @color-grey-dark;
    cursor: pointer;
    margin: 0 4px;
  }
  nav .animation {
    position: absolute;
    height: 100%;
    top: 0;
    z-index: 0;
    width: 0px;
    transition: all 0.5s ease 0s;
    background: @color-white;
    border-radius: @nxd-border-radius;
  }
  a {
    width: auto;
    padding: 0 16px;
  }
  a.router-link-exact-active {
    background: transparent;
    color: @color-navy;
  }
}
</style>
