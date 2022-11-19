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
import { FiCheck } from "react-icons/fi";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddToBalanceForm from './AddToBalanceForm';
import PayInstallmentForm from './PayInstallmentform';
import AddBorrowerForm from './AddBorrowerForm';
import { BlockchainContext } from '../context/BlockchainContext';
import WithdrawForm from './WithdrawForm';

function StatsCard(props) {
    const { title, stat, icon, bgColor } = props;
    return (
        <Stat
            px={{ base: 1, md: 4 }}
            py={'5'}
            shadow={'xl'}
            border={'5px solid'}
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
    const { borrowerExists, borrowerBalance, canTakeLoan } = useContext(BlockchainContext);
    if (!borrowerExists) {
        return (
            <>
                <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
                    <chakra.h1
                        textAlign={'center'}
                        fontSize={'4xl'}
                        py={10}
                        fontWeight={'bold'}>
                        You need to be a borrower to see your stats
                    </chakra.h1>
                    <Flex justifyContent={'center'} alignItems={'center'}>
                        <AddBorrowerForm />
                    </Flex>
                </Box>
                <ToastContainer autoClose={3000} />
            </>
        );
    } else {
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
                            stat={!canTakeLoan? 'Loan active' : 'Loan inactive'}
                            bgColor={!canTakeLoan? 'green.300' : 'red.300'}
                            icon={<FiCheck size={'3em'} />}
                        />
                        <StatsCard
                            title={'Next installment amount'}
                            stat={canTakeLoan? 0.00 : '-'}
                            icon={<RiMoneyDollarCircleLine size={'3em'} />}
                        />
                        <StatsCard
                            title={'Next installment due date'}
                            stat={canTakeLoan? 0.00 : '-'}
                            icon={<AiOutlineClockCircle size={'3em'} />}
                        />
                        <StatsCard
                            title={'Installment to pay number'}
                            stat={canTakeLoan? 0 : '-'}
                            icon={<MdOutlineAccountBalanceWallet size={'3em'} />}
                        />
                        <StatsCard
                            title={'Loan interest rate'}
                            stat={canTakeLoan? 0 + "%" : '-'}
                            icon={<MdOutlineAccountBalanceWallet size={'3em'} />}
                        />
                        :

                    </SimpleGrid>
                    <Flex justifyContent={'center'} alignItems={'center'}>
                        <AddToBalanceForm />
                        <WithdrawForm />
                        <PayInstallmentForm />
                    </Flex>
                </Box>
                <ToastContainer autoClose={3000} />
            </>
        );
    }

}