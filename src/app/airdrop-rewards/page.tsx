"use client"

import { getPoolRewards } from '@/services/api/PoolServices'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/ui/card'
import { Badge } from '@/ui/badge'
import { formatNumberWithSuffix, truncateString } from '@/utils/format'
import { useLang } from '@/lang'
import { useIsMobile } from '@/hooks/use-mobile'
import {
    Gift,
    TrendingUp,
    Users,
    Wallet,
    Calendar,
    Award,
    Loader2,
    Copy,
    ChevronDown,
    ChevronUp,
    ExternalLink
} from 'lucide-react'

const page = () => {
    const { t, lang } = useLang()
    const isMobile = useIsMobile()
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    const { data: poolRewards, isLoading: isLoadingPoolRewards } = useQuery({
        queryKey: ["pool-rewards"],
        queryFn: () => getPoolRewards(),
        refetchOnMount: true,
        staleTime: 0,
        refetchOnWindowFocus: false,
    })

    const handleCopyAddress = (address: string) => {
        navigator.clipboard.writeText(address)
        setToastMessage('Address copied to clipboard!')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 2000)
    }

    const toggleExpanded = (id: string) => {
        const newExpanded = new Set(expandedItems)
        if (newExpanded.has(id)) {
            newExpanded.delete(id)
        } else {
            newExpanded.add(id)
        }
        setExpandedItems(newExpanded)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'can_withdraw':
                return <Badge variant="default" className="bg-gray-500 text-white">{t('airdropRewards.status.can_withdraw')}</Badge>
            case 'withdrawn':
                return <Badge variant="secondary" className="bg-green-500 text-white">{t('airdropRewards.status.withdrawn')}</Badge>
            case 'pending':
                return <Badge variant="outline" className="border-yellow-500 text-yellow-600">{t('airdropRewards.status.pending')}</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getRewardTypeIcon = (subType: string) => {
        switch (subType) {
            case 'leader_bonus':
                return <Award className="w-5 h-5 text-yellow-500" />
            case 'participation_share':
                return <Gift className="w-5 h-5 text-purple-500" />
            case 'top_pool_reward':
                return <TrendingUp className="w-5 h-5 text-green-500" />
            default:
                return <Users className="w-5 h-5 text-blue-500" />
        }
    }

    const getDateLocale = () => {
        switch (lang) {
            case 'vi':
                return 'vi-VN'
            case 'kr':
                return 'ko-KR'
            case 'jp':
                return 'ja-JP'
            default:
                return 'en-US'
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString(getDateLocale(), {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Loading Skeleton
    if (isLoadingPoolRewards) {
        return (
            <div className="container mx-auto p-4 md:p-6 flex flex-col gap-6">
                {/* Header Skeleton */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />
                    <div className="h-8 w-48 bg-gray-300 rounded animate-pulse" />
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="border-none bg-gray-200 dark:bg-gray-800 animate-pulse">
                            <CardHeader className="pb-2">
                                <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
                            </CardHeader>
                            <CardContent>
                                <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Table Skeleton */}
                <div className="space-y-4">
                    <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded" />
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    const stats = poolRewards?.data?.stats
    const rewards = poolRewards?.data?.rewards || []

    // Mobile Card Component
    const MobileRewardCard = ({ reward, index }: { reward: any; index: number }) => {
        const isExpanded = expandedItems.has(reward.ar_id)
        const translate = (text: string) => {
            switch (text) {
                case 'Leader Bonus (10%)':
                    return t('airdropRewards.table.leader_bonus')
                case 'Participation Share (90%)':
                    return t('airdropRewards.table.participation_share')
                case 'Top Pool Reward':
                    return t('airdropRewards.table.top_pool_reward')
                case 'Volume-based Reward':
                    return t('airdropRewards.table.volume_based_reward')
                default:
                    return text
            }
        }
        return (
            <Card key={reward.ar_id} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            {getRewardTypeIcon(reward.ar_sub_type)}
                            <div className="flex flex-col gap-1">
                                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                    {reward.token_name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {translate(reward.reward_description)}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {getStatusBadge(reward.ar_status)}
                            <button
                                onClick={() => toggleExpanded(reward.ar_id)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                            >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="mb-3">
                        <div className="text-lg font-bold text-theme-primary-500">
                            {reward.ar_amount}
                        </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1 mb-3 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(reward.ar_date)}</span>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
                            <div className="text-xs">
                                <span className="text-gray-500 dark:text-gray-400 uppercase mr-2">
                                    {t('airdropRewards.table.mint')}:
                                </span>
                                <span className="text-yellow-500 font-mono">
                                    {reward.token_mint}
                                </span>
                            </div>
                            
                            {reward.ar_hash && (
                                <div className="flex items-center justify-between">
                                    <div className="text-xs">
                                        <span className="text-gray-500 dark:text-gray-400 uppercase mr-2">
                                            {t('airdropRewards.table.hashTx')}:
                                        </span>
                                        <span className="text-yellow-500 font-mono">
                                            {truncateString(reward.ar_hash, 12)}
                                        </span>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleCopyAddress(reward.ar_hash)}
                                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                                        >
                                            <Copy className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => window.open(`https://solscan.io/tx/${reward.ar_hash}`, '_blank')}
                                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        )
    }
    const translate = (text: string) => {
        switch (text) {
            case 'Leader Bonus (10%)':
                return t('airdropRewards.table.leader_bonus')
            case 'Participation Share (90%)':
                return t('airdropRewards.table.participation_share')
            case 'Top Pool Reward':
                return t('airdropRewards.table.top_pool_reward')
            case 'Volume-based Reward':
                return t('airdropRewards.table.volume_based_reward')
            default:
                return text
        }
    }

    return (
        <div className="container mx-auto p-4 md:p-6 flex flex-col gap-6">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-in slide-in-from-right">
                    {toastMessage}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-3">
                <Gift className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
                <h1 className="text-2xl md:text-3xl font-bold">{t('airdropRewards.title')}</h1>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <Card className="border-none bg-green-500 py-3 px-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                            <h3 className="text-base md:text-lg font-semibold">{t('airdropRewards.stats.totalRewards')}</h3>
                            <Gift className="h-4 w-4 text-white" />
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-xl md:text-2xl font-bold text-white">{stats.total_rewards}</div>
                            <p className="text-xs md:text-sm text-green-100">
                                {formatNumberWithSuffix(stats.total_amount)} {t('airdropRewards.stats.totalAmount')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-gray-800 py-3 px-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                            <h3 className="text-base md:text-lg font-semibold text-white">{t('airdropRewards.stats.waitingRewards')}</h3>
                            <Wallet className="h-4 w-4 text-gray-300" />
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-xl md:text-2xl font-bold text-white">{stats.can_withdraw_count}</div>
                            <p className="text-xs md:text-sm text-gray-300">
                                {formatNumberWithSuffix(stats.total_can_withdraw_amount)} {t('airdropRewards.stats.available')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-gray-500/60 py-3 px-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                            <h3 className="text-base md:text-lg font-semibold text-white">{t('airdropRewards.stats.rewarded')}</h3>
                            <TrendingUp className="h-4 w-4 text-gray-300" />
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-xl md:text-2xl font-bold text-white">{stats.withdrawn_count}</div>
                            <p className="text-xs md:text-sm text-gray-300">
                                {formatNumberWithSuffix(stats.total_withdrawn_amount)} {t('airdropRewards.stats.total')}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Rewards Section */}
            <div>
                <h2 className="text-lg md:text-xl font-semibold mb-4">{t('airdropRewards.rewardHistory')}</h2>
                
                {isMobile ? (
                    // Mobile Card View
                    <div className="space-y-4">
                        {rewards.map((reward: any, index: number) => (
                            <MobileRewardCard key={reward.ar_id} reward={reward} index={index} />
                        ))}
                    </div>
                ) : (
                    // Desktop Table View
                    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                            {t('airdropRewards.table.token')}
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                            {t('airdropRewards.table.amount')}
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                            {t('airdropRewards.table.type')}
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                            {t('airdropRewards.table.status')}
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                            {t('airdropRewards.table.date')}
                                        </th>
                                        {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                            {t('airdropRewards.table.hashTx')}
                                        </th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rewards.map((reward: any, index: number) => (
                                        <tr key={reward.ar_id} className={`border-t border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}`}>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                                                <div className="flex flex-col gap-1">
                                                    <div className="font-medium">{reward.token_name}</div>
                                                    <div className="text-xs text-yellow-500 font-mono">
                                                        {truncateString(reward.token_mint, 20)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                                                <div className="text-theme-primary-500 font-semibold">
                                                    {reward.ar_amount}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    {getRewardTypeIcon(reward.ar_sub_type)}
                                                    <span>{translate(reward.reward_description)}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                                                {getStatusBadge(reward.ar_status)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                    <span>{formatDate(reward.ar_date)}</span>
                                                </div>
                                            </td>
                                            {/* <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-yellow-500 font-mono">
                                                        {truncateString(reward.ar_hash, 12)}
                                                    </span>
                                                    {reward.ar_hash && (
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => handleCopyAddress(reward.ar_hash)}
                                                                className="text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition-colors p-1"
                                                            >
                                                                <Copy className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => window.open(`https://solscan.io/tx/${reward.ar_hash}`, '_blank')}
                                                                className="text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition-colors p-1"
                                                            >
                                                                <ExternalLink className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {rewards.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">{t('airdropRewards.empty')}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default page