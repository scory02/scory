<template>
    <n-layout has-sider>
        <n-layout-sider v-if="!isMobile" collapse-mode="transform" :collapsed-width="80" :width="250"
            show-trigger="arrow-circle" bordered :collapsed="collapsed" @collapse="oncollapsed" @expand="oncollapsed">
            <n-menu :collapsed-width="80" :collapsed-icon-size="22" accordion :options="routes" :key-field="menu.prop.key"
                :label-field="menu.prop.label" :children-field="menu.prop.children" v-model:value="selectedKey"
                v-model:expanded-keys="expandedKeys" :collapsed="collapsed" :render-label="renderMenuLabel"
                :render-icon="renderMenuIcon" @update:expanded-keys="UpdateExpandedKeys" @update:value="menuCheckd" />
            <n-switch v-model:value="theme.theme" size="large" @update:value="containerRef" class="switch">
                <template #checked>
                    暗黑
                </template>
                <template #unchecked>
                    白天
                </template>
            </n-switch>
        </n-layout-sider>
        <n-layout class="w-full h-full">
            <n-scrollbar>
                <n-layout-header bordered v-if="isMobile">
                    <n-menu mode="horizontal" :collapsed-width="80" :collapsed-icon-size="22" accordion :options="routes"
                        :key-field="menu.prop.key" :label-field="menu.prop.label" :children-field="menu.prop.children"
                        v-model:value="selectedKey" v-model:expanded-keys="expandedKeys" :collapsed="false"
                        :render-label="renderMenuLabel" :render-icon="renderMenuIcon"
                        @update:expanded-keys="UpdateExpandedKeys" @update:value="menuCheckd" />
                    <n-switch v-model:value="theme.theme" size="large" @update:value="containerRef" class="switch">
                        <template #checked>
                            暗黑
                        </template>
                        <template #unchecked>
                            白天
                        </template>
                    </n-switch>
                </n-layout-header>
                <n-layout-content content-style="display:flex;flex-direction: column;<!-- height: calc(100% - 41px); -->">
                    <div class="flex h-10 justify-center items-center">
                        <div class="flex flex-1 h-10 items-center">
                            <n-breadcrumb>
                                <n-breadcrumb-item>
                                    <n-dropdown :options="dropdown.children" :key-field="menu.prop.key"
                                        :label-field="menu.prop.label" :children-field="menu.prop.children"
                                        @select="menuCheckd">
                                        <div class="trigger">
                                            {{ dropdown[menu.prop.label] }}
                                        </div>
                                    </n-dropdown>
                                </n-breadcrumb-item>
                                <n-breadcrumb-item>
                                    <n-dropdown>
                                        <div class="trigger">
                                            {{ selectedName }}
                                        </div>
                                    </n-dropdown>
                                </n-breadcrumb-item>
                            </n-breadcrumb>
                        </div>
                        <n-space justify="space-around" size="large" class="items-center m-5">
                            <n-button text style="font-size: 24px" @click="full">
                                <n-icon size="20">
                                    <FullScreenMaximize16Filled />
                                </n-icon>
                            </n-button>
                            <n-button text style="font-size: 24px" @click="reload">
                                <n-icon size="20">
                                    <ArrowClockwise16Regular />
                                </n-icon>
                            </n-button>
                            <n-dropdown trigger="hover" :options="userInfOptions" @select="userInfoSelect">
                                <n-avatar round size="medium" src="/scory.svg" />
                            </n-dropdown>
                        </n-space>
                    </div>
                    <n-scrollbar>
                        <router-view v-slot="{ Component, route }">
                            <transition name="fade">
                                <div class="w-full h-full" :key="route.path" id="routerview">
                                    <component v-if="reloadViable" :is="Component" class="h-full" />
                                </div>
                            </transition>
                        </router-view>
                        <n-back-top :right="100" />
                    </n-scrollbar>
                </n-layout-content>
            </n-scrollbar>
            <!-- <n-layout-footer bordered position="absolute"
                style="height: 40px;line-height:40px;text-align: center;z-index: 9999;">
                <span style="font-family:arial;">Copyright &copy;scory </span>
                <n-divider vertical />
                <a href="https://beian.miit.gov.cn/" target="_blank" class="a">陕ICP备2023002971号-1</a>
            </n-layout-footer> -->
        </n-layout>
    </n-layout>
    <n-watermark :content="Watermark.watermark" cross fullscreen :font-size="16" :line-height="16" :width="384"
        :height="384" :x-offset="12" :y-offset="60" :rotate="-15" />
</template>

<script setup>
import { NIcon, NEllipsis, NAvatar, NText, useMessage } from "naive-ui";
import { FullScreenMaximize16Filled, ArrowClockwise16Regular, Glance20Regular, ArrowForwardDownPerson20Filled } from '@vicons/fluent'
import { useTheme, changeWatermark } from '@/store/modules'
import screenfull from 'screenfull';
import router from '@/router'
import routes from '@/router/routes'
import { menu } from '@/enums'
import { useWindowSize } from '@vueuse/core'
const { width, height } = useWindowSize()
const isMobile = computed(() => width.value <= 1000)
window['message'] = useMessage()
let themeStyle = ref('#ffffff') //当前map主题

let meunlocal = window['this']?.getlocalStorage(menu.key) //获取本地菜单缓存
let collapsed = ref(meunlocal?.collapsed || ref(false));
const currentpath = router.getRoutes().find(item => item.path == router.currentRoute.value.path) //当前路由
let selectedKey = ref(currentpath?.path) || ref('/');
let selectedName = ref(currentpath?.name) || ref('/');
let expandedKeys = ref(meunlocal?.expandedKeys) || ref('/');
const Watermark = changeWatermark()
const theme = useTheme()
let dropdown = ref({});
let reloadViable = ref(true);
const renderIcon = (icon) => {
    return () => {
        return h(NIcon, null, {
            default: () => h(icon)
        });
    };
};
function renderCustomHeader() {
    return h(
        "div",
        {
            style: "display: flex; align-items: center; padding: 8px 12px;"
        },
        [
            h(NAvatar, {
                round: true,
                style: "margin-right: 12px;",
                src: "/scory.svg"
            }),
            h("div", null, [
                h("div", null, [h(NText, { depth: 2 }, { default: () => "scory" })]),
                h("div", { style: "font-size: 12px;" }, [
                    h(
                        NText,
                        { depth: 3 },
                        { default: () => "个人技术博客" }
                    )
                ])
            ])
        ]
    );
}
const logout = () => {
    localStorage?.clear()
    sessionStorage?.clear()
    router?.replace('/login')
}
const userInfOptions = [
    {
        key: "header",
        type: "render",
        render: renderCustomHeader
    },
    {
        label: "退出登录",
        key: "logout",
        icon: renderIcon(ArrowForwardDownPerson20Filled),
        onclick: logout
    }
]
const userInfoSelect = (key, e) => {
    e?.onclick()
    message.info(String(key), e);
}
onMounted(() => {
    menuCheckd(selectedKey.value, currentpath)
})
const getMenus = (val) => {
    let data = {}
    routes.map((item) => {
        const children = item?.children?.filter(p => p.path !== val)
        if (children) {
            let childrens = [];
            children.map((child) => {
                const { meta, name, ...others } = child
                childrens.push({
                    name: meta?.title,
                    ...others
                })
            })
            data = {
                ...item, children: childrens
            }
        }
    })
    return data
}
const menuCheckd = (val, e) => {
    dropdown.value = getMenus(val)
    selectedName.value = e.meta?.title || e.name
    selectedKey.value = val
    router.push(val)
    savemeunlocal()
    Watermark.change(val) // 调用 actions 并传入参数
}
const oncollapsed = () => {
    collapsed.value = collapsed.value ? false : true
    savemeunlocal()
}
const UpdateExpandedKeys = (val) => {
    expandedKeys.value = val
    savemeunlocal()
}
const renderMenuLabel = (option) => {
    if (option?.meta?.title) {
        return option?.meta?.title;
    } else {
        if ("name" in option) {
            return h(
                NEllipsis,
                null,
                { default: () => option[menu.prop.label] }
            );
        }
        return option[menu.prop.label];
    }
}
const renderMenuIcon = (option) => {
    return h(NIcon, null, { default: () => h(Glance20Regular) });
}
const savemeunlocal = () => {
    window['this']?.setlocalStorage(menu.key, {
        collapsed: collapsed.value, expandedKeys: expandedKeys.value
    }) //设置本地菜单缓存
}
const containerRef = (val) => {
    theme.change(val)
}
const full = async () => {
    const element = document.getElementById('routerview');
    if (screenfull.isEnabled) {
        screenfull.request(element);
    }
}
const reload = async () => {
    reloadViable.value = false
    await nextTick();
    setTimeout(() => {
        reloadViable.value = true
    }, 1000)
}
// 监听单个 state
watch(theme, (newX) => {
    themeStyle.value = newX.theme ? '#18181c' : '#ffffff'
})
onBeforeUnmount(() => {
    savemeunlocal()
})
</script>

<style lang="less">
.n-layout {
    width: 100%;
    height: 100%;
}

.n-layout-sider-scroll-container {
    min-width: auto !important;
    &::-webkit-scrollbar {
        width: 5px;
        height: 1px;
    }
    
    
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #ccc;
    }
    
    &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #EDEDED;
    }
}

.n-scrollbar>.n-scrollbar-container {
    display: grid;
}

.n-scrollbar>.n-scrollbar-container>.n-scrollbar-content {
    padding: 10px;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: -webkit-fill-available;
}

.switch {
    position: absolute;
    margin: 0 auto;
    width: -webkit-fill-available;
    bottom: 10px;
}

#routerview {
    background-color: v-bind(themeStyle);
}
</style>