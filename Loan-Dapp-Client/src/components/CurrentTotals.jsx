import {
    Box,
    chakra,
    Flex,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
} from '@chakra-ui/react';
import { ReactNode, useContext } from 'react';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddToBalanceForm from './AddToBalanceForm';
import PayInstallmentForm from './PayInstallmentform';
import { BlockchainContext } from '../context/BlockchainContext';

function StatsCard(props) {
    const { title, stat, icon, bgColor } = props;
    return (
        <Stat
            px={{ base: 2, md: 4 }}
            py={'5'}
            shadow={'xl'}
            border={'1px solid'}
            borderColor={useColorModeValue('gray.800', 'gray.500')}
            rounded={'lg'}
            backgroundColor={bgColor}>
            <Flex justifyContent={'space-between'}>
                <Box pl={{ base: 2, md: 4 }}>
                    <StatLabel fontWeight={'medium'} isTruncated>
                        {title}
                    </StatLabel>
                    <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
                        {stat}
                    </StatNumber>
                </Box>
                <Box
                    my={'auto'}
                    color={useColorModeValue('gray.800', 'gray.200')}
                    alignContent={'center'}>
                    {icon}
                </Box>
            </Flex>
        </Stat>
    );
}

export default function CurrentTotals() {
    const { borrowerBalance, due, duration, renter } = useContext(BlockchainContext);
    return (
        <>
            <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
                <chakra.h1
                    textAlign={'center'}
                    fontSize={'4xl'}
                    py={10}
                    fontWeight={'bold'}>
                    Welcome! Here are your stats:
                </chakra.h1>
                <SimpleGrid columns={{ base: 1, md: 6 }} spacing={{ base: 5, lg: 8 }}>
                    <StatsCard
                        title={'Ethereum funds balance'}
                        stat={borrowerBalance}
                        icon={<MdOutlineAccountBalanceWallet size={'3em'} />}
                    />
                    <StatsCard
                        title={'Next installment amount'}
                        stat={0.00}
                        icon={<RiMoneyDollarCircleLine size={'3em'} />}
                    />
                    <StatsCard
                        title={'Next installment due date'}
                        stat={0}
                        icon={<AiOutlineClockCircle size={'3em'} />}
                    />
                    <StatsCard
                        title={'Installment to pay number'}
                        stat={0}
                        icon={<MdOutlineAccountBalanceWallet size={'3em'} />}
                    />
                    <StatsCard
                        title={'Loan interest rate'}
                        stat={0 + '%'}
                        icon={<MdOutlineAccountBalanceWallet size={'3em'} />}
                    />
                    <StatsCard
                        title={'Loan Status'}
                        bgColor={'green'}
                    />
                </SimpleGrid>
                <Flex justifyContent={'center'} alignItems={'center'}>
                    <AddToBalanceForm />
                    <PayInstallmentForm />
                </Flex>
            </Box>
            <ToastContainer autoClose={3000} />
        </>
    );
}