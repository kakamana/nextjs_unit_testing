import nextConfig from '../../next.config';

describe('Security Headers', () => {
  it('defines headers() with required security headers', async () => {
    // @ts-ignore headers exists per NextConfig
    const result = await nextConfig.headers?.();
    expect(Array.isArray(result)).toBe(true);
    const allHeaders = result?.[0]?.headers ?? [];

    const keys = allHeaders.map((h: { key: string }) => h.key);
    expect(keys).toEqual(
      expect.arrayContaining([
        'Strict-Transport-Security',
        'X-Content-Type-Options',
        'X-Frame-Options',
        'Referrer-Policy',
        'Permissions-Policy',
        'Content-Security-Policy',
      ])
    );

    const csp = allHeaders.find((h: { key: string }) => h.key === 'Content-Security-Policy');
    expect(csp?.value).toContain("default-src 'self'");
    expect(csp?.value).toContain("script-src 'self'");
    expect(csp?.value).toContain("frame-ancestors 'none'");
  });
});
