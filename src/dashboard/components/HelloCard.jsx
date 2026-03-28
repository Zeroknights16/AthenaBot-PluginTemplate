"use client";

import { Card, Group, Text, ThemeIcon } from '@mantine/core';
import { TbPlug } from 'react-icons/tb';

export default function HelloCard({ title, value, hint }) {
    return (
        <Card withBorder radius="md" p="lg" bg="rgba(255,255,255,0.02)">
            <Group justify="space-between" mb="xs">
                <Text fw={600} c="white">{title}</Text>
                <ThemeIcon size="lg" variant="light" color="green">
                    <TbPlug size={16} />
                </ThemeIcon>
            </Group>
            <Text size="xl" fw={800} c="white">{value}</Text>
            <Text size="sm" c="dimmed" mt={4}>{hint}</Text>
        </Card>
    );
}
