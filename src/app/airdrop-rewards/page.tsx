"use client"

import { getPoolRewards } from '@/services/api/PoolServices'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Card, CardContent, CardHeader } from '@/ui/card'
import { Badge } from '@/ui/badge'
import { formatNumberWithSuffix, truncateString } from '@/utils/format'
import { useLang } from '@/lang'
import {
    Gift,
    TrendingUp,
    Users,
    Wallet,
    Calendar,
    Award,
    Loader2,
    Copy
} from 'lucide-react'

const page = () => {
    const { t, lang } = useLang()

    const { data: poolRewards, isLoading: isLoadingPoolRewards } = useQuery({
        queryKey: ["pool-rewards"],
        queryFn: () => getPoolRewards(),
        refetchOnMount: true,
        staleTime: 0,
        refetchOnWindowFocus: false,
    })

    const handleCopyAddress = (address: string) => {
        navigator.clipboard.writeText(address)
        // You can add toast notification here
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'can_withdraw':
                return <Badge variant="default" className="bg-gray-500">{t('airdropRewards.status.can_withdraw')}</Badge>
            case 'withdrawn':
                return <Badge variant="secondary" className="bg-green-500">{t('airdropRewards.status.withdrawn')}</Badge>
            case 'pending':
                return <Badge variant="outline" className="border-yellow-500 text-yellow-600">{t('airdropRewards.status.pending')}</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getRewardTypeIcon = (subType: string) => {
        switch (subType) {
            case 'leader_bonus':
                return <Award className="w-4 h-4 text-yellow-500" />
            case 'participation_share':
                return <Gift className="w-4 h-4 text-purple-500" />
            case 'top_pool_reward':
                return <TrendingUp className="w-4 h-4 text-green-500" />
            default:
                return <Users className="w-4 h-4 text-blue-500" />
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

    if (isLoadingPoolRewards) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        )
    }

    const stats = poolRewards?.data?.stats
    const rewards = poolRewards?.data?.rewards || []

    return (
        <div className="container mx-auto p-6 flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Gift className="w-8 h-8 text-purple-500" />
                <h1 className="text-3xl font-bold">{t('airdropRewards.title')}</h1>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <Card className="border-none bg-green-500 py-3 px-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                            <h3 className="text-lg font-semibold">{t('airdropRewards.stats.totalRewards')}</h3>
                            <Gift className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_rewards}</div>
                            <p className="text-sm text-muted-foreground">
                                {formatNumberWithSuffix(stats.total_amount)} {t('airdropRewards.stats.totalAmount')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-gray-800 py-2 px-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                            <h3 className="text-lg font-semibold">{t('airdropRewards.stats.waitingRewards')}</h3>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.can_withdraw_count}</div>
                            <p className="text-sm text-muted-foreground">
                                {formatNumberWithSuffix(stats.total_can_withdraw_amount)} {t('airdropRewards.stats.available')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-gray-500/60 py-2 px-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                            <h3 className="text-lg font-semibold">{t('airdropRewards.stats.rewarded')}</h3>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.withdrawn_count}</div>
                            <p className="text-sm text-muted-foreground">
                                {formatNumberWithSuffix(stats.total_withdrawn_amount)} {t('airdropRewards.stats.total')}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Rewards Table */}
            <div>
                {t('airdropRewards.rewardHistory')}
            </div>


            <div>
                <div className="overflow-hidden rounded-t-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <div className="overflow-x-auto scrollbar-thin max-h-[60vh] scroll-smooth">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">{t('airdropRewards.table.token')}</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">{t('airdropRewards.table.amount')}</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">{t('airdropRewards.table.type')}</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">{t('airdropRewards.table.status')}</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">{t('airdropRewards.table.date')}</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">{t('airdropRewards.table.hashTx')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rewards.map((reward: any, index: number) => (
                                    <tr key={reward.ar_id} className={`border-t border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}`}>
                                        <td className="px-4 py-3 text-xs text-gray-900 dark:text-gray-300">
                                            <div className="flex items-center gap-2">
                                                {/* <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                {reward.token_name?.charAt(0)?.toUpperCase()}
                                            </div> */}
                                                <div className="flex flex-col gap-1">
                                                    <div className="font-medium text-sm"><span className="text-gray-300 uppercase mr-1">{t('airdropRewards.table.name')}:</span> {reward.token_name}</div>
                                                    <div className="text-xs text-yellow-500">
                                                        <span className="text-gray-300 uppercase mr-2">{t('airdropRewards.table.mint')}:</span> {truncateString(reward.token_mint, 20)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-900 dark:text-gray-300">
                                            <div className="flex flex-col">
                                                <div className="text-xs text-theme-primary-500">
                                                    {reward.ar_amount}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-900 dark:text-gray-300">
                                            <div className="flex items-center gap-2">
                                                {getRewardTypeIcon(reward.ar_sub_type)}
                                                <span className="text-sm">{reward.reward_description}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-900 dark:text-gray-300">
                                            {getStatusBadge(reward.ar_status)}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-900 dark:text-gray-300">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                                <span className="text-sm">{formatDate(reward.ar_date)}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-yellow-500 italic">
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs font-mono">
                                                    {truncateString(reward.ar_hash, 12)}
                                                </span>
                                                {reward.ar_hash && (
                                                    <button
                                                        onClick={() => handleCopyAddress(reward.ar_hash)}
                                                        className="text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition-colors p-1"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {rewards.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground bg-gray-700/40 rounded-b-md">
                        <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>{t('airdropRewards.empty')}</p>
                    </div>
                )}
            </div>

            {/* Token Breakdown */}
            {/* {stats?.breakdown_by_token && stats.breakdown_by_token.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Rewards by Token</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stats.breakdown_by_token.map((token: any) => (
                                <div key={token.token_id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                            {token.token_name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{token.token_name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {token.count} rewards
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-sm">
                                            {formatNumberWithSuffix(token.total_amount)}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {token.token_name}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )} */}
        </div>
    )
}

export default page