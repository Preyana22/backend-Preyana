import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import PostsService from "./flights.service";
import ParamsWithId from "../utils/paramsWithId";
import PostDto from "./dto/flights.dto";
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import RequestWithUser from "../authentication/requestWithUser.interface";
import MongooseClassSerializerInterceptor from "../utils/mongooseClassSerializer.interceptor";
import { Post as PostModel } from "./flights.schema";
import { PaginationParams } from "../utils/paginationParams";
import UpdatePostDto from "./dto/updateFlights.dto";
import { Duffel } from "@duffel/api";
import { date } from "@hapi/joi";
@Controller("airlines")
@UseInterceptors(MongooseClassSerializerInterceptor(PostModel))
export default class PostsController {
  constructor(private readonly PostsService: PostsService) {}

  @Get("airports/:searchQuery")
  async getFlight(@Param("searchQuery") searchQuery: string) {
    let Result = [];
    const duffelHeaders = {
      "Duffel-Version": "v1",
      Authorization:
        "Bearer duffel_live_iVxhZcQG0tlGfWgY9aq4ZuRCV-m4GwIDGmljueNXgKq",
    };
    const getAirports = await fetch(
      "https://api.duffel.com/places/suggestions?query=" + searchQuery,
      {
        method: "GET",
        headers: duffelHeaders,
      }
    );

    return getAirports.text();
  }

  @Get()
  async getAllPosts(
    @Query() { skip, limit, startId }: PaginationParams,
    @Query("searchQuery") searchQuery: string
  ) {
    // return this.postService.findAll(skip, limit, startId, searchQuery);
  }

  @Post("test")
  async airliness(@Body() req: any) {
    let Adults = [];

    let adultsData = {
      type: "adult",
    };

    for (var i = 0; i <= req.numOfPassengers.adult; i++) {
      Adults.push(adultsData);
    }

    const duffel = new Duffel({
      token: "duffel_live_iVxhZcQG0tlGfWgY9aq4ZuRCV-m4GwIDGmljueNXgKq",
    });

    let econamy: any = "econamy";

    if (req.returnDate === undefined) {
      var slices = [
        {
          origin: req.origin,
          destination: req.destination,
          departure_date: req.departureDate,
        },
      ];
    } else {
      var slices = [
        {
          origin: req.origin,
          destination: req.destination,
          departure_date: req.departureDate,
        },
        {
          origin: req.destination,
          destination: req.origin,
          departure_date: req.returnDate,
        },
      ];
    }

    const offerRequest = await duffel.offerRequests.create({
      slices: slices,
      passengers: req.numOfPassengers,
      cabin_class: req.cabin_class,
    });

    let offerResult = [];
    let offers_clientkey: any;
    offers_clientkey = offerRequest.data;
    let test = offers_clientkey?.client_key;

    let client_key = "client_key";
    offerResult.push(test);
    offerResult.push(offerRequest.data.offers);

    return JSON.stringify(offerResult);
  }

  @Post("book")
  async booking(@Body() @Req() request: any) {
    console.log("in ts");

    const duffelHeaders = {
      "Duffel-Version": "v1",
      "Accept-Encoding": "gzip",
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization:
        "Bearer duffel_live_iVxhZcQG0tlGfWgY9aq4ZuRCV-m4GwIDGmljueNXgKq",
    };

    const clone = JSON.parse(JSON.stringify(request));
    console.log(clone);
    if (clone.type === "hold") {
      delete clone.payments;
    }
    var data1 = { data: clone };

    console.log("data");
    console.log(data1);

    var payments = { data: request.payments };

    console.log("payments", payments);

    // Making the first API call to create the order
    const createOrderOnDuffelResponse = await fetch(
      "https://api.duffel.com/air/orders",
      {
        method: "POST",
        headers: duffelHeaders,
        body: JSON.stringify(data1),
      }
    );
    const orderResponseText = await createOrderOnDuffelResponse.json();
    console.log("Order Response:", orderResponseText);

    // Making the second API call to create the payment intent
    const createPaymentIntent = await fetch(
      "https://api.duffel.com/payments/payment_intents",
      {
        method: "POST",
        headers: duffelHeaders,
        body: JSON.stringify(payments),
      }
    );
    const paymentIntentText = await createPaymentIntent.json();
    console.log("Payment Intent Response:", paymentIntentText);

    // Combining both responses into a single object
    const combinedResponse = {
      orderResponse: orderResponseText,
      paymentIntentResponse: paymentIntentText,
    };
    console.log("Combined Response:", combinedResponse);
    // Returning the combined response as JSON
    return {
      data: combinedResponse,
      errors: null,
    };
  }

  @Post("confirm")
  async confirmPayment(@Body() req: any) {
    console.log("confirmPayment in ts", req);

    const paymentIntent = req.paymentIntent;
    const duffelHeaders = {
      "Duffel-Version": "v1",
      "Accept-Encoding": "gzip",
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization:
        "Bearer duffel_live_iVxhZcQG0tlGfWgY9aq4ZuRCV-m4GwIDGmljueNXgKq",
    };

    // Making the second API call to create the payment intent
    const createPaymentIntent = await fetch(
      `https://api.duffel.com/payments/payment_intents/${paymentIntent}/actions/confirm`,
      {
        method: "POST",
        headers: duffelHeaders,
      }
    );
    const paymentIntentText = await createPaymentIntent.json();
    console.log("Payment Intent Response:", paymentIntentText);

    // Returning the combined response as JSON
    return {
      data: paymentIntentText,
      errors: null,
    };
  }
}
