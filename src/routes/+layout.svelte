<script lang="ts">
 import './layout.css';
 import {page} from '$app/stores';
 import {afterNavigate} from '$app/navigation';
 import {onMount} from 'svelte';
 import {Breadcrumb, BreadcrumbItem, Dropdown, DropdownItem} from 'flowbite-svelte';
 import {currentUser} from '$lib/data/mock';
 import {getLocale, initLocale, type Locale, setLocale, t} from '$lib/i18n/index.svelte';

 let {children} = $props();

 afterNavigate(() => {
  initLocale();
 });

 // 水合完成后移除骨架屏
 onMount(() => {
  const skeleton = document.getElementById('app-skeleton');
  if (skeleton) skeleton.remove();
 });

 let navItems = $derived([
  {href: '/', label: t('nav.dashboard'), icon: 'home'},
  {href: '/apply', label: t('nav.apply'), icon: 'plus-circle'},
  {href: '/applications/my', label: t('nav.myApplications'), icon: 'document-text'},
  {href: '/applications', label: t('nav.allApplications'), icon: 'clipboard-list'},
  {href: '/reports', label: t('nav.reports'), icon: 'chart-bar'}
 ]);

 function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  // 精确匹配或匹配到下一级路径，避免 /applications 在 /applications/my 时也高亮
  if (pathname !== href && !pathname.startsWith(href + '/')) return false;
  // 找到最具体的匹配项（最长路径），只有它才高亮
  const bestMatch = navItems
   .filter((n) => n.href === '/' ? pathname === '/' : pathname === n.href || pathname.startsWith(n.href + '/'))
   .sort((a, b) => b.href.length - a.href.length)[0];
  return bestMatch?.href === href;
 }

 function getBreadcrumb(pathname: string): string {
  const item = navItems
   .filter((n) => n.href === '/' ? pathname === '/' : pathname === n.href || pathname.startsWith(n.href + '/'))
   .sort((a, b) => b.href.length - a.href.length)[0];
  return item?.label ?? '';
 }

 let currentPage = $derived($page.url.pathname);
 let breadcrumbTitle = $derived(getBreadcrumb(currentPage));

 const languageOptions: { value: Locale; label: string }[] = [
  {value: 'zh', label: '中文'},
  {value: 'en', label: 'English'}
 ];

 function handleLanguageChange(lang: Locale) {
  setLocale(lang);
 }
</script>
<svelte:head>
	<title>{t('nav.systemName')}</title>
</svelte:head>
<div class="flex min-h-screen bg-gray-50 dark:bg-gray-900">
	<!-- 左侧边栏 -->
	<aside
	 class="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white transition-transform dark:border-gray-700 dark:bg-gray-800">
		<!-- Logo 区域 -->
		<div class="flex h-16 items-center gap-3 border-b border-gray-200 px-6 dark:border-gray-700">
			<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
				<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					 d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
				</svg>
			</div>
			<span class="text-lg font-bold text-gray-900 dark:text-white">{t('nav.systemName')}</span>
		</div>
		<!-- 导航菜单 -->
		<nav class="space-y-1 px-3 py-4">
			{#each navItems as item}
				<a
				 href={item.href}
				 class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
						{isActive(currentPage, item.href)
							? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
							: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}"
				>
					<!-- 图标 -->
					{#if item.icon === 'home'}
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							 d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
						</svg>
					{:else if item.icon === 'plus-circle'}
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							 d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					{:else if item.icon === 'document-text'}
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							 d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
						</svg>
					{:else if item.icon === 'clipboard-list'}
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							 d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
						</svg>
					{:else if item.icon === 'chart-bar'}
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							 d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
						</svg>
					{/if}
					{item.label}
				</a>
			{/each}
		</nav>
		<!-- 底部用户信息 -->
		<div class="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4 dark:border-gray-700">
			<div class="flex items-center gap-3">
				<div
				 class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
					{currentUser.name.charAt(0)}
				</div>
				<div class="flex-1 overflow-hidden">
					<p class="truncate text-sm font-medium text-gray-900 dark:text-white">{currentUser.name}</p>
					<p
					 class="truncate text-xs text-gray-500 dark:text-gray-400">{currentUser.role === 'admin' ? t('nav.admin') : t('nav.user')}</p>
				</div>
			</div>
		</div>
	</aside>
	<!-- 右侧主区域 -->
	<div class="ml-64 flex flex-1 flex-col">
		<!-- 顶部导航栏 -->
		<header
		 class="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800 shadow-2xs">
			<!-- 面包屑 -->
			<Breadcrumb class="flex-1">
				<BreadcrumbItem href="/" home>{t('nav.home')}</BreadcrumbItem>
				{#if breadcrumbTitle}
					<BreadcrumbItem>{breadcrumbTitle}</BreadcrumbItem>
				{/if}
			</Breadcrumb>
			<!-- 右侧操作区 -->
			<div class="flex items-center gap-4">
				<!-- 搜索框 -->
				<!-- 通知按钮 -->
				<button
				 class="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						 d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
					</svg>
					<span class="absolute right-1.5 top-1.5 flex h-2 w-2">
						<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
						<span class="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
					</span>
				</button>
				<!-- 语言切换 -->
				<button
				 type="button"
				 class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						 d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
					</svg>
				</button>
				<Dropdown class="w-32 list-none" placement="bottom">
					{#each languageOptions as lang}
						<DropdownItem
						 onclick={() => handleLanguageChange(lang.value)}
						 class={getLocale() === lang.value ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : ''}
						>
							<div class="flex items-center gap-2">
								{#if getLocale() === lang.value}
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
									</svg>
								{/if}
								<span>{lang.label}</span>
							</div>
						</DropdownItem>
					{/each}
				</Dropdown>
				<!-- 用户下拉菜单 -->
			</div>
		</header>
		<!-- 主内容区域 -->
		<main class="flex-1 p-6">
			{@render children()}
		</main>
	</div>
</div>
