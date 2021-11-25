from setuptools import find_packages, setup

setup(
    name='group-management',
    version='1.0.0',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'click',
        'requests',
    ],
    entry_points={
        'console_scripts': [
            'mgmt = group_management.commands:cli',
        ],
    },
)
