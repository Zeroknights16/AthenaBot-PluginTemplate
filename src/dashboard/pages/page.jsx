"use client";

import { useEffect, useMemo, useState } from 'react';
import { Box, Group, Loader, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import HelloCard from '../../../../components/addons/template-addon/HelloCard';

const API_BASE = process.env.NEXT_PUBLIC_ATHENA_WEB_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_ATHENA_WEB_API_KEY;

export default function TemplateAddonPage() {
    const [loading, setLoading] = useState(true);
    const [rawConfig, setRawConfig] = useState(null);

    useEffect(() => {
        let canceled = false;

        const run = async () => {
            try {
                const response = await fetch(`${API_BASE}/api/dashboard/config/hello/data`, {
                    headers: { authorization: API_KEY }
                });
                const data = await response.json();
                if (!canceled && data?.status_code === 200) {
                    setRawConfig(data?.data?.rawData || null);
                }
            }
            catch {
                if (!canceled) setRawConfig(null);
            }
            finally {
                if (!canceled) setLoading(false);
            }
        };

        run();
        return () => {
            canceled = true;
        };
    }, []);

    const panelCount = useMemo(() => {
        const panels = rawConfig?.config?.dashboard_panels;
        return Array.isArray(panels) ? panels.length : 0;
    }, [rawConfig]);

    const ruleCount = useMemo(() => {
        const rules = rawConfig?.config?.alert_rules;
        return rules && typeof rules === 'object' ? Object.keys(rules).length : 0;
    }, [rawConfig]);

    if (loading) {
        return (
            <Box p="xl">
                <Group>
                    <Loader color="green" size="sm" />
                    <Text c="dimmed">Loading template addon data...</Text>
                </Group>
            </Box>
        );
    }

    return (
        <Stack p="xl" gap="lg">
            <Title order={3} c="white">Template Addon Page</Title>
            <Text c="dimmed" maw={760}>
                This page is shipped by your plugin from src/dashboard/pages/page.jsx.
                Use it as a starting point for custom plugin dashboard pages.
            </Text>

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <HelloCard
                    title="Dashboard Panels"
                    value={String(panelCount)}
                    hint="Entries loaded from hello.config.dashboard_panels"
                />
                <HelloCard
                    title="Alert Rule Groups"
                    value={String(ruleCount)}
                    hint="Dynamic keys loaded from hello.config.alert_rules"
                />
            </SimpleGrid>
        </Stack>
    );
}
