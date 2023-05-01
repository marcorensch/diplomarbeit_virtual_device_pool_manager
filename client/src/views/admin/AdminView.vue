<template>
  <div class="admin-view">
    <div class="uk-section uk-section-small uk-padding-remove-bottom">
      <div class="uk-container">
        <div
          class="nxd-background-horizon uk-border-rounded horizontal-submenu-container"
        >
          <div uk-slider="finite:true">
            <div class="uk-position-relative">
              <div class="uk-slider-container">
                <ul id="horizontal-submenu" class="uk-slider-items">
                  <template v-for="link of adminRouterLinks" :key="link.path">
                    <li v-if="auth.hasPermission(link.permission)">
                      <router-link class="uk-text-nowrap" :to="link.path">
                        <font-awesome-icon :icon="'fas fa-' + link.icon" />
                        {{ link.label }}
                      </router-link>
                    </li>
                  </template>

                  <div class="animation"></div>
                </ul>
              </div>
              <a
                class="uk-position-center-left slider-left uk-hidden@m"
                uk-slidenav-previous
                uk-slider-item="previous"
              >
              </a>
              <a
                class="uk-position-center-right slider-right uk-hidden@m"
                uk-slidenav-next
                uk-slider-item="next"
              >
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <component :is="Component" @navSelected="handleNavSelected" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "AdminView",
  components: { FontAwesomeIcon },
  data() {
    return {
      auth: useAuthStore(),
      adminRouterLinks: [
        {
          label: "Dashboard",
          path: "/admin",
          icon: "grip",
          permission: "canAccessAdmin",
        },
        {
          label: "MSISDN Manager",
          path: "/admin/msisdn-manager",
          icon: "mobile-screen-button",
          permission: "canAccessMsisdnManager",
        },
        {
          label: "Account Manager",
          path: "/admin/accounts",
          icon: "users",
          permission: "canAccessAccountManager",
        },
        {
          label: "Pool Builder",
          path: "/admin/pool-builder",
          icon: "cubes",
          permission: "canAccessPoolBuilder",
        },
        {
          label: "GuideMe Manager",
          path: "/admin/guideme-manager",
          icon: "book",
          permission: "canAccessGuideMeManager",
        },
      ],
    };
  },
  mounted() {
    this.setNavPosition();
    const navLinks = document.querySelectorAll("#horizontal-submenu a");
    for (const navLink of navLinks) {
      navLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.animateNav(e);
      });
    }
  },
  methods: {
    handleNavSelected() {
      this.$nextTick(() => {
        this.setNavPosition();
      });
    },
    setNavPosition() {
      const navLinks = document.querySelectorAll("#horizontal-submenu a");
      for (const navLink of navLinks) {
        if (navLink.classList.contains("router-link-exact-active")) {
          const navElement = navLink.closest("li");
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
      const parentListItem = target.closest("li");
      const navAnimation = document.querySelector(".animation");
      const navAnimationWidth = parentListItem.offsetWidth;
      const navAnimationLeft = parentListItem.offsetLeft;
      navAnimation.style.width = navAnimationWidth + "px";
      navAnimation.style.left = navAnimationLeft + "px";

      console.log(navAnimation.style.width);
    },
  },
};
</script>
