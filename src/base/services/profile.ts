import { prisma } from "@/common/providers/prismaClient";
import { ServiceResponse } from "@/common/types/ServiceResponse";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  format,
  getDay,
  getMonth,
  getQuarter,
  getWeek,
  getYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  sub,
} from "date-fns";
import { ProfileOverview } from "@/base/schemas/profileOverview";

type Period = "1W" | "1M" | "3M" | "1Y";

const eachPeriodOfInterval = ({ period }: { period: Period }) => {
  const today = new Date();

  switch (period) {
    case "1W":
      return eachDayOfInterval({
        start: sub(today, { days: 6 }),
        end: today,
      });
    case "1M":
      return eachWeekOfInterval(
        {
          start: sub(today, { months: 1 }),
          end: today,
        },
        { weekStartsOn: 0 }
      );
    case "3M":
      return eachMonthOfInterval({
        start: sub(today, { months: 3 - 1 }),
        end: today,
      });
    case "1Y":
      return eachMonthOfInterval({
        start: sub(today, { months: 12 - 1 }),
        end: today,
      });
  }

  return [];
};

const getDateRangeForPeriod = ({ period }: { period: Period }) => {
  const today = new Date();
  let earliest = today;

  switch (period) {
    case "1W":
      earliest = sub(today, { days: 7 - 1 });
      break;
    case "1M":
      earliest = sub(today, { weeks: 4 });
      break;
    case "3M":
      earliest = sub(today, { months: 3 });
      break;
    case "1Y":
      earliest = sub(today, { months: 12 - 1 });
      break;
  }

  return [startOfDay(earliest), today];
};

export const fetchProfile = async (
  userId: string,
  period: Period
): Promise<ServiceResponse<ProfileOverview>> => {
  const [earliest, latest] = getDateRangeForPeriod({ period });

  const result = await prisma.user.findFirst({
    where: {
      id: Number(userId),
    },
    select: {
      id: true,
      challengeAttempts: {
        where: {
          completed: {
            gte: earliest,
          },
        },
        select: {
          completed: true,
          points_scored: true,
        },
        orderBy: {
          completed: "asc",
        },
      },
    },
  });

  const buckets = eachPeriodOfInterval({ period }).reduce(
    (buckets, currentDate) => {
      const bucketName = String(
        getBucketForPeriod({ date: currentDate, period: period })
      );
      buckets[bucketName] = 0;
      return buckets;
    },
    {} as Record<string, number>
  );

  const bucketedResults = result?.challengeAttempts.reduce((accum, current) => {
    const key = getBucketForPeriod({
      date: current.completed!,
      period: period,
    });
    accum[key!] += current.points_scored;
    return accum;
  }, buckets);

  if (result?.id === undefined || bucketedResults === undefined) {
    return { error: "Invalid profile", data: null };
  }

  return {
    data: { id: result?.id, attemptsByPeriod: bucketedResults },
    error: null,
  };
};

const getBucketForPeriod = ({
  date,
  period,
}: {
  date: Date;
  period: Period;
}) => {
  switch (period) {
    case "1W":
      return format(date, "yyyy-MM-dd");
    case "1M":
      return format(startOfWeek(date), "yyyy-MM-dd");
    case "3M":
      return format(startOfWeek(date), "yyyy-MM-dd");
    case "1Y":
      return format(startOfMonth(date), "yyyy-MM-dd");
  }
};
